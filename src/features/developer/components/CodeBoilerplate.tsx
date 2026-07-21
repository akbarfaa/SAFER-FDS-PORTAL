/**
 * Developer Hub — Integration Code Boilerplate Generator
 */
import { Code, Check, Copy } from "lucide-react";

interface CodeBoilerplateProps {
  activeTab: "curl" | "node" | "python";
  copied: boolean;
  clientId: string;
  clientSecret: string;
  payload: Record<string, any>;
  onTabChange: (tab: "curl" | "node" | "python") => void;
  onCopy: () => void;
}

export function CodeBoilerplate({
  activeTab,
  copied,
  clientId,
  clientSecret,
  payload,
  onTabChange,
  onCopy,
}: CodeBoilerplateProps) {
  const getCurlCode = () => `curl -X POST https://api.safer.web.id/transactions/simulate \\
  -H "Content-Type: application/json" \\
  ${clientId ? `-H "X-Client-ID: ${clientId}" \\\n  -H "X-Client-Secret: ${clientSecret}" \\\n  ` : ""}-d '${JSON.stringify(payload, null, 2)}'`;

  const getNodeCode = () => `const axios = require('axios');
 
const payload = ${JSON.stringify(payload, null, 2)};
const headers = {
  'Content-Type': 'application/json'${clientId ? `,\n  'X-Client-ID': '${clientId}',\n  'X-Client-Secret': '${clientSecret}'` : ""}
};
 
axios.post('https://api.safer.web.id/transactions/simulate', payload, { headers })
  .then(response => {
    console.log('Risk Score:', response.data.risk_score);
    console.log('Severity:', response.data.severity);
    console.log('Reasoning:', response.data.ai_reasoning);
  })
  .catch(error => console.error('Error scoring:', error));`;

  const getPythonCode = () => `import requests
 
payload = ${JSON.stringify(payload, null, 2)}
headers = {
    'Content-Type': 'application/json'${clientId ? `,\n    'X-Client-ID': '${clientId}',\n    'X-Client-Secret': '${clientSecret}'` : ""}
}
 
response = requests.post(
    'https://api.safer.web.id/transactions/simulate',
    json=payload,
    headers=headers
)
 
if response.status_code == 200:
    data = response.json()
    print(f"Risk Score: {data['risk_score']}")
    print(f"Severity: {data['severity']}")
    print(f"Reasoning: {data['ai_reasoning']}")`;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-5 py-4 flex items-center justify-between">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <Code className="h-4 w-4 text-primary" /> Integration Boilerplate
        </h3>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1 transition-colors bg-muted/10 hover:bg-muted/30"
        >
          {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy Code"}
        </button>
      </div>

      <div className="bg-muted/20 border-b border-border flex text-xs">
        {(["curl", "node", "python"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-[1px] ${
              activeTab === tab
                ? "border-primary text-primary bg-card"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "curl" ? "cURL" : tab === "node" ? "Node.js (Axios)" : "Python (Requests)"}
          </button>
        ))}
      </div>

      <div className="p-4 bg-[#090d16] overflow-x-auto max-h-[350px]">
        <pre className="text-xs font-mono text-indigo-200 leading-relaxed">
          {activeTab === "curl" && getCurlCode()}
          {activeTab === "node" && getNodeCode()}
          {activeTab === "python" && getPythonCode()}
        </pre>
      </div>
    </div>
  );
}
