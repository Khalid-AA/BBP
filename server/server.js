import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
const apiKey = process.env.API_KEY;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({ 
    origin: ["http://localhost:5173"] // Port that Vite serves on
}));
app.use(express.json());

let hospitals = [];
let bloodTypes = [];
let bloodGroups = {};
let donationAmounts = {}; 

// Parse PDF to extract data
const parsePDF = async () => {
    const pdfPath = path.resolve(__dirname, 'MockData2.pdf');
    if (!fs.existsSync(pdfPath)) throw new Error(`File not found: ${pdfPath}`);
    
    const pdfBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(pdfBuffer);
    const lines = data.text.split('\n').map(line => line.trim()); 

    // Define a regex pattern for the header
    const headerPattern = /^blood_group\s+gender\s+donation_amount\(ml\)\s+hospital$/i;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip the header line
        if (headerPattern.test(line)) {
            continue; 
        }

        const match = line.match(/^(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/);
        if (match) {
            const bloodGroup = match[1].trim();
            const gender = match[2].trim();
            const donationAmount = parseInt(match[3].trim(), 10); 
            const hospital = match[4].trim();
            
            if (bloodGroup && hospital) {
                if (!bloodTypes.includes(bloodGroup)) bloodTypes.push(bloodGroup);
                if (!hospitals.includes(hospital)) hospitals.push(hospital);
                if (!bloodGroups[hospital]) bloodGroups[hospital] = [];
                if (!bloodGroups[hospital].includes(bloodGroup)) bloodGroups[hospital].push(bloodGroup);
                
                // Accumulate donation amounts for each blood group
                if (!donationAmounts[bloodGroup]) {
                    donationAmounts[bloodGroup] = 0; // Initialize if it doesn't exist
                }
                donationAmounts[bloodGroup] += donationAmount; 
            }
        }
    }
};

// Initialize data from PDF
const initData = async () => {
    try {
        await parsePDF();
    } catch (error) {
        console.error('Error initializing data:', error.message);
    }
};

initData();

// Output response based on input
const outputResponse = (input) => {
    if (hospitals.includes(input)) {
        return bloodGroups[input] ? bloodGroups[input].join(', ') : 'No blood groups found';
    }
    if (bloodTypes.includes(input)) {
        const hospitalsList = Object.keys(bloodGroups)
            .filter(hospital => bloodGroups[hospital].includes(input))
            .join(', ') || 'No hospitals found';
        return {
            hospitals: hospitalsList
        };
    }
    return 'No relevant information found for the input';
};


const generateIAMToken = async () => {
    const url = 'https://iam.cloud.ibm.com/identity/token';
    try {
        const response = await axios.post(url, new URLSearchParams({
            grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
            apikey: apiKey
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error generating IAM token:', error.message);
        throw new Error('Failed to generate IAM token');
    }
};

export const generateText = async (input) => {
    const url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
    const token = await generateIAMToken();
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
    const body = {
        input: `<|system|>\nYou are Granite Chat, an AI language model developed by IBM. You are a cautious assistant...<|user|>\n${input}\n<|assistant|>\n`,
        parameters: {
            decoding_method: "greedy",
            max_new_tokens: 900,
            min_new_tokens: 0,
            stop_sequences: [],
            repetition_penalty: 1.05
        },
        model_id: "ibm/granite-13b-chat-v2",
        project_id: "1c1b4428-88c3-4e14-9e57-36e5c789cf5b",
        moderations: {
            hap: {
                input: {
                    enabled: true,
                    threshold: 0.5,
                    mask: {
                        remove_entity_value: true
                    }
                },
                output: {
                    enabled: true,
                    threshold: 0.5,
                    mask: {
                        remove_entity_value: true
                    }
                }
            }
        }
    };

    const response = await fetch(url, {
        headers,
        method: "POST",
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error("Non-200 response");
    }

    const jsonResponse = await response.json();
    return jsonResponse.results[0].generated_text; 
};



// API Endpoints
app.get("/api", (req, res) => {
    res.json({ 
        blood_types: bloodTypes, 
        hospitals: hospitals, 
        donationAmounts: donationAmounts
    });
});

app.post("/generate", (req, res) => {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: "Input is required" });
    
    const output = outputResponse(input);
    res.json({ output });
});

app.post('/generateText', async (req, res) => {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: 'Input is required' });

    try {
        const generatedResponse = await generateText(input);
        res.json({ output: generatedResponse });
    } catch (error) {
        console.error('Error generating text:', error);
        res.status(500).json({ error: 'Failed to generate text.' });
    }
});


app.listen(8080, () => {
    console.log("Server started on port 8080");
});
