# AVAA API Guide

A comprehensive reference for all AVAA platform APIs including Agent Execution, Workflows, Agentic Processes, Tools, Guardrails, and MCP Server integration.

---

## INDEX

- **Prerequisites & Authentication**

- **Document Overview**

- **1. Agent Execution API (without Input)**

- **2. Agent Execution with Input File**

- **3. Workflow APIs**
  - 3.1 Workflow Execution API
  - 3.2 Workflow User Authentication API

- **4. Agentic Process APIs**
  - 4.1 User authentication details
  - 4.2 Studio authentication
  - 4.3 Output Logs

- **5. Tools Execution APIs**

- **6. Guardrail Execution API**

- **7. MCP Server APIs**
  - 7.1 MCP Authorization (JIRA)
  - 7.2 MCP Authorization (ADO)
  - 7.3 Providers: (ADO)
  - 7.4 Disconnecting MCP
  - 7.5 MCP Server List

- **HTTP Status Codes**

---

## Prerequisites & Authentication

Before using any AAVA TM Platform APIs, ensure you have the following:

- **SSO configured** for platform access
- **API key/Access token** (Bearer authentication)
- **REST API knowledge**

### API Key Generation

To generate your API key:

1. Log in to **AAVA TM Platform** at [https://int-ai.aava.ai](https://int-ai.aava.ai)
2. Navigate to: **Profile → Account Settings → Generate New Token**
3. Copy and securely store your token

**Security Best Practices:**

- Store keys securely using environment variables or secure credential management systems
- Never commit API keys to version control
- Never share API keys publicly
- Regenerate your key immediately if compromised or lost

**Authentication:**

All API requests require Bearer token authentication. Include your token in the request header:

```
Authorization: Bearer YOUR_API_TOKEN
```

---

## 1. Agent Execution API (without Input)

**Endpoint:** `https://int-ai.aava.ai/agents/execute/agent-executions`

**Description:** Executes an agent with the given input and returns the execution result.

**Method:** `POST`

**Headers:**

| Key           | Value                           |
| ------------- | ------------------------------- |
| Authorization | Bearer YOUR_API_TOKEN           |
| Accept        | application/json,text/plain,_/_ |
| Content-Type  | application/json                |

**Sample Request:**

> **Note:** This example executes a sample agent with `agentId = 50720`.

**Request Body:**

```json
{
  "agentId": "50720",
  "userInputs": {
    "{{DocumentationTitle}}": "",
    "{{IntendedAudience}}": "",
    "{{DocumentationPurpose}}": "",
    "{{Requirements}}": "",
    "{{APIDocumentationLink}}": ""
  },
  "executionId": "8219de5d-ecc0-4cb1-be95-c03ca3723113",
  "files": "(binary)"
}
```

**Response (Success 200 OK):**

```json
{
  "data": {
    "jobId": 42131,
    "agentExecutionId": "0b013afe-fae1-469c-8f52-3646385c5405",
    "message": "Agent job submitted successfully",
    "httpStatus": "OK"
  },
  "status": "SUCCESS"
}
```

**Parameters:**

- `agentId` (string, required): The unique identifier of the agent to execute
- `userInputs` (object, optional): Key-value pairs for agent input parameters (use template variable names as keys)
- `executionId` (string, required): A unique execution identifier (UUID format)
- `files` (binary, optional): Binary file data if the agent requires file input

---

## 2. Agent Execution with Input File

**Endpoint:** `https://int-ai.aava.ai/agents/execute/agent-executions`

**Description:** Executes an agent and attaches files for processing.

**Method:** `POST`

**Headers:**

| Key           | Value                           |
| ------------- | ------------------------------- |
| Authorization | Bearer YOUR_API_TOKEN           |
| Accept        | application/json,text/plain,_/_ |
| Content-Type  | multipart/form-data             |

**Sample Request:**

> **Note:** This example executes a sample agent with `agentId = 11378`.

**Payload:**

| Key        | Type | Value                                   |
| ---------- | ---- | --------------------------------------- |
| agentId    | Text | 11378                                   |
| userInputs | Text | {"{{input_string_true}}":""}            |
| files      | File | (binary file upload - agent input file) |

**Using Postman:**

1. Set the request method to `POST`
2. Enter the endpoint URL
3. Under **Headers**, add:
   - `Authorization: Bearer YOUR_API_TOKEN`
   - `Accept: application/json,text/plain,*/*`
   - Do not manually set `Content-Type` (Postman will automatically set it to `multipart/form-data` with boundary)
4. Under **Body**, select **form-data**:
   - Add key `agentId` (Type: Text) with value `11378`
   - Add key `userInputs` (Type: Text) with value `{"{{input_string_true}}":""}`
   - Add key `files` (Type: File) and select the file to upload

**Using cURL:**

```bash
curl -X POST https://int-ai.aava.ai/agents/execute/agent-executions \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json,text/plain,*/*" \
  -F "agentId=11378" \
  -F "userInputs={\"{{input_string_true}}\":\"\"}" \
  -F "files=@/path/to/your/file.txt"
```

**Response (Success 200 OK):**

```json
{
  "data": {
    "jobId": 58794,
    "agentExecutionId": "36c792ef-90aa-40f5-8c0c-fa02f1633b86",
    "message": "Agent job submitted successfully",
    "httpStatus": "OK",
    "success": true
  },
  "status": "SUCCESS"
}
```

---

## 3. Workflow APIs

### 3.1 Workflow Execution API

**Endpoint:** `https://int-ai.aava.ai/workflows/workflow-executions`

**Description:** Executes a workflow (agent pipeline) based on user-supplied inputs and returns its output.

**Method:** `POST`

**Headers:**

| Key           | Value                           |
| ------------- | ------------------------------- |
| Authorization | Bearer YOUR_API_TOKEN           |
| Accept        | application/json,text/plain,_/_ |

**Sample Request:**

> **Note:** This example executes a sample workflow with `pipelineId = 21208`.

**Payload (Form-data):**

| Key        | Type | Value                            |
| ---------- | ---- | -------------------------------- |
| pipelineId | Text | 21208                            |
| userInputs | Text | {"{{featureid_string_true}}":""} |
| priority   | Text | 1                                |

**Using Postman:**

1. Set the request method to `POST`
2. Enter the endpoint URL
3. Under **Headers**, add:
   - `Authorization: Bearer YOUR_API_TOKEN`
   - `Accept: application/json,text/plain,*/*`
4. Under **Body**, select **form-data**:
   - Add key `pipelineId` (Type: Text) with value `21208`
   - Add key `userInputs` (Type: Text) with value `{"{{featureid_string_true}}":""}`
   - Add key `priority` (Type: Text) with value `1`

**Using cURL:**

```bash
curl -X POST https://int-ai.aava.ai/workflows/workflow-executions \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json,text/plain,*/*" \
  -F "pipelineId=21208" \
  -F "userInputs={\"{{featureid_string_true}}\":\"\"}" \
  -F "priority=1"
```

**Response (Success 200 OK):**

```json
{
  "data": {
    "message": "Job submitted successfully",
    "workflowExecutionId": "c2a23c1a-4711-41bf-876b-a71b91c8fa1b",
    "jobId": 121641
  },
  "status": "SUCCESS"
}
```

**Parameters:**

- `pipelineId` (string, required): The unique identifier of the workflow pipeline to execute
- `userInputs` (object, optional): Key-value pairs for workflow input parameters (use template variable names as keys)
- `priority` (string, optional): Execution priority level (default: 1)

### 3.2 Workflow User Authentication API

**Endpoint:** `https://int-ai.aava.ai/api/auth/user/details/v2`

**Description:** Authenticates current user for the workflow and retrieves user details including roles and studio access.

**Method:** `GET`

**Headers:**

| Key           | Value                 |
| ------------- | --------------------- |
| Authorization | Bearer YOUR_API_TOKEN |

**Response (Success 200 OK):**

```json
{
  "data": {
    "userId": 385,
    "userName": "User Full Name",
    "email": "name.lastname@ascendion.com",
    "realms": [],
    "roles": [{ "name": "Admin" }, { "name": "User" }],
    "studioInfo": [
      { "name": "Console", "url": "https://int-ai.aava.ai/console/" },
      { "name": "Data Studio", "url": "https://int-ai.aava.ai/data-studios/" },
      {
        "name": "Experience Studio",
        "url": "https://int-ai.aava.ai/experience/"
      },
      { "name": "Launchpad", "url": "https://int-ai.aava.ai/launchpad/" },
      { "name": "Product Studio", "url": "https://int-ai.aava.ai/product/" }
    ]
  },
  "status": "SUCCESS"
}
```

**Use Cases:**

- Verify user authentication before executing workflows
- Retrieve user role information for authorization checks
- Access available studio URLs for the authenticated user

---

## 4. Agentic Process APIs

### 4.1 User authentication details

**Endpoint:** `https://int-ai.aava.ai/api/auth/user/details/v2`

**Description:** Retrieves the authenticated user's profile details.

**Method:** `GET`

**Headers:**

| Key           | Value                 |
| ------------- | --------------------- |
| Authorization | Bearer YOUR_API_TOKEN |

**Sample Request:**

**Using Postman:**

1. Set the request method to `GET`
2. Enter the endpoint URL: `https://int-ai.aava.ai/api/auth/user/details/v2`
3. Under **Headers**, add:
   - `Authorization: Bearer YOUR_API_TOKEN`

**Using cURL:**

```bash
curl -X GET https://int-ai.aava.ai/api/auth/user/details/v2 \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response (Success 200 OK):**

```json
{
  "data": {
    "userId": 385,
    "userName": "Firstname Lastname",
    "email": "firstname.lastname@ascendion.com",
    "realms": [],
    "roles": [
      {
        "name": "Admin"
      },
      {
        "name": "User"
      }
    ],
    "studioInfo": [
      {
        "name": "Console",
        "url": "https://int-ai.aava.ai/console/"
      },
      {
        "name": "Data Studio",
        "url": "https://int-ai.aava.ai/data-studios/"
      },
      {
        "name": "Experience Studio",
        "url": "https://int-ai.aava.ai/experience/"
      },
      {
        "name": "Launchpad",
        "url": "https://int-ai.aava.ai/launchpad/"
      },
      {
        "name": "Product Studio",
        "url": "https://int-ai.aava.ai/product/"
      }
    ]
  },
  "status": "SUCCESS"
}
```

### 4.2 Studio authentication

**Endpoint:** `https://int-ai.aava.ai/api/auth/studioInfo`

**Description:** Retrieves studio metadata and configuration details.

**Method:** `GET`

**Headers:**

| Key           | Value                 |
| ------------- | --------------------- |
| Authorization | Bearer YOUR_API_TOKEN |

**Sample Request:**

**Using Postman:**

1. Set the request method to `GET`
2. Enter the endpoint URL: `https://int-ai.aava.ai/api/auth/studioInfo`
3. Under **Headers**, add:
   - `Authorization: Bearer YOUR_API_TOKEN`

**Using cURL:**

```bash
curl -X GET https://int-ai.aava.ai/api/auth/studioInfo \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response (Success 200 OK):**

```json
{
  "data": {
    "id": 385,
    "name": "firstname.lastname@ascendion.com",
    "studioInfoList": [
      {
        "id": 3,
        "name": "console",
        "image": null,
        "portalUrls": [
          "https://int-ai.aava.ai/console/",
          "https://int-ai.aava.ai/launchpad/"
        ]
      },
      {
        "id": 7,
        "name": "Product Studio",
        "image": null,
        "portalUrls": ["https://int-ai.aava.ai/product/"]
      },
      {
        "id": 8,
        "name": "Experience Studio",
        "image": null,
        "portalUrls": ["https://int-ai.aava.ai/experience/"]
      },
      {
        "id": 18,
        "name": "Data Studio",
        "image": null,
        "portalUrls": ["https://int-ai.aava.ai/data-studios/"]
      }
    ]
  },
  "status": "SUCCESS"
}
```

**Response Fields:**

- `data.id` (integer): The user's unique identifier
- `data.name` (string): The user's email or username
- `data.studioInfoList` (array): List of available studios for the user
  - `id` (integer): Studio unique identifier
  - `name` (string): Studio display name
  - `image` (string, nullable): Studio icon/image URL (if available)
  - `portalUrls` (array): List of accessible portal URLs for the studio

**Use Cases:**

- Retrieve available studio configurations for the authenticated user
- Dynamically populate studio navigation menus
- Validate studio access permissions
- Get portal URLs for deep linking into specific studios

**Differences from User Details API:**

While the `/api/auth/user/details/v2` endpoint (section 4.1) returns basic user information with a simplified `studioInfo` array containing only name and URL pairs, the `/api/auth/studioInfo` endpoint provides:

- Unique studio identifiers for programmatic access
- Multiple portal URLs per studio (e.g., Console includes both `/console/` and `/launchpad/`)
- Image metadata for custom UI rendering
- More detailed studio configuration data

**Example Integration:**

```javascript
// Fetch studio information
fetch("https://int-ai.aava.ai/api/auth/studioInfo", {
  headers: { Authorization: "Bearer YOUR_API_TOKEN" },
})
  .then((res) => res.json())
  .then((data) => console.log("Available studios:", data.data.studioInfoList));
```

### 4.3 Output Logs

**Endpoint:** `https://int-ai.aava.ai/process-service/api/v1/process-executions/{executionId}/output-logs`

**Description:** Retrieves the process-level execution logs (workflow and task status events) for the specified process execution.

**Method:** `GET`

**Headers:**

| Key           | Value                           |
| ------------- | ------------------------------- |
| Authorization | Bearer YOUR_API_TOKEN           |
| Accept        | application/json,text/plain,_/_ |

**Sample Request:**

> **Note:** This example retrieves output logs for a process execution with `executionId = 773`.

**Using Postman:**

1. Set the request method to `GET`
2. Enter the endpoint URL: `https://int-ai.aava.ai/process-service/api/v1/process-executions/773/output-logs`
3. Under **Headers**, add:
   - `Authorization: Bearer YOUR_API_TOKEN`
   - `Accept: application/json,text/plain,*/*`

**Using cURL:**

```bash
curl -X GET https://int-ai.aava.ai/process-service/api/v1/process-executions/773/output-logs \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json,text/plain,*/*"
```

**URL Parameters:**

- `executionId` (integer, required): The unique identifier of the process execution

**Response (Success 200 OK):**

The response contains comprehensive execution details including:

- **execution**: High-level process execution metadata
- **nodeOutputs**: Detailed output for each node in the process
- **tasks**: User task information and decisions
- **runtimeLogs**: Chronological log of all workflow events
- **sequenceStatus**: Overall completion status

```json
{
  "execution": {
    "id": 773,
    "processDefinitionId": 236,
    "processVersion": 1,
    "orchestrationExecutionId": 773,
    "status": "COMPLETED",
    "startedBy": "firstname.lastname@ascendion.com",
    "startedAt": "2026-08-18T18:18:19.310058Z",
    "endedAt": "2026-08-18T19:10:36.660340Z",
    "currentNodeId": "ee2384d5-9fe4-4a54-9432-aec0de40f982",
    "currentNodeName": "802e4fd0-67ba-449b-85a7-6b8c9d04d43d",
    "currentNodeType": "end",
    "currentAssignee": "firstname.lastname@ascendion.com",
    "resultStatus": "COMPLETED",
    "resultSummary": "{\"executionId\":...}",
    "failureCode": null,
    "failureReason": null,
    "lastEventType": "WORKFLOW_COMPLETED",
    "terminalReason": null,
    "correlationId": "a05a09f2-e8ca-43b1-b763-7c2414e4efe8",
    "tenantId": 1,
    "realmId": 1,
    "processName": "New",
    "executionInputMode": "PRE_START_ALL",
    "startUserInputsJson": "{\"{{featureid_string_true}}\":\"\"}"
  },
  "nodeOutputs": [
    {
      "id": 5913,
      "processExecutionId": 773,
      "nodeId": "6f992b68-1a7b-4163-b2d6-f0703cdcfd77",
      "nodeName": "6f992b68-1a7b-4163-b2d6-f0703cdcfd77",
      "nodeType": null,
      "status": "COMPLETED",
      "attempt": 1,
      "startedAt": "2026-08-18T18:18:21.878Z",
      "endedAt": "2026-08-18T18:18:21.878Z",
      "eventType": "NODE_COMPLETED",
      "statusReason": null,
      "details": null,
      "errorMessage": null,
      "resultSummary": null,
      "sequenceStatus": "Success",
      "executorType": null,
      "executorRef": null
    },
    {
      "id": 5914,
      "processExecutionId": 773,
      "nodeId": "060f8947-d633-4ae5-99dc-d53ebc588447",
      "nodeName": "060f8947-d633-4ae5-99dc-d53ebc588447",
      "nodeType": "serviceTask",
      "status": "COMPLETED",
      "attempt": 1,
      "startedAt": "2026-08-18T18:18:25.926Z",
      "endedAt": "2026-08-18T18:23:39.643Z",
      "eventType": "NODE_COMPLETED",
      "statusReason": "SUCCEEDED",
      "details": "{\"status\":\"SUCCEEDED\",\"httpStatus\":200,\"responseBody\":\"...\"}",
      "errorMessage": null,
      "resultSummary": "{\"status\":\"SUCCEEDED\",\"processDefinitionId\":236,...}",
      "sequenceStatus": "Success",
      "executorType": "AAVA_WORKFLOW_JOB",
      "executorRef": "6207d5e1-0e86-4e2d-88f1-6336a145f22a"
    },
    {
      "id": 5915,
      "processExecutionId": 773,
      "nodeId": "f79b4b9c-03b0-4ab8-a8af-cdede97a3c0f",
      "nodeName": "f79b4b9c-03b0-4ab8-a8af-cdede97a3c0f",
      "nodeType": "serviceTask",
      "status": "COMPLETED",
      "attempt": 1,
      "startedAt": "2026-08-18T18:23:42.215Z",
      "endedAt": "2026-08-18T18:25:17.890Z",
      "eventType": "NODE_COMPLETED",
      "statusReason": "SUCCEEDED",
      "details": "{\"status\":\"SUCCEEDED\",\"httpStatus\":200,\"responseBody\":\"...\"}",
      "errorMessage": null,
      "resultSummary": "{\"status\":\"SUCCEEDED\",\"processDefinitionId\":236,...}",
      "sequenceStatus": "Success",
      "executorType": "AAVA_AGENT_JOB",
      "executorRef": "b0553e49-b3f1-4b46-b176-53979bfb32a4"
    },
    {
      "id": 5916,
      "processExecutionId": 773,
      "nodeId": "802e4fd0-67ba-449b-85a7-6b8c9d04d43d",
      "nodeName": "802e4fd0-67ba-449b-85a7-6b8c9d04d43d",
      "nodeType": null,
      "status": "COMPLETED",
      "attempt": 1,
      "startedAt": "2026-08-18T18:25:20.120Z",
      "endedAt": "2026-08-18T19:10:26.095Z",
      "eventType": "NODE_COMPLETED",
      "statusReason": "USER_APPROVED",
      "details": "Validated!",
      "errorMessage": null,
      "resultSummary": "Validated!",
      "sequenceStatus": "Accepted",
      "executorType": null,
      "executorRef": null
    },
    {
      "id": 5917,
      "processExecutionId": 773,
      "nodeId": "ee2384d5-9fe4-4a54-9432-aec0de40f982",
      "nodeName": "ee2384d5-9fe4-4a54-9432-aec0de40f982",
      "nodeType": null,
      "status": "COMPLETED",
      "attempt": 1,
      "startedAt": "2026-08-18T19:10:30.908Z",
      "endedAt": "2026-08-18T19:10:30.908Z",
      "eventType": "NODE_COMPLETED",
      "statusReason": null,
      "details": null,
      "errorMessage": null,
      "resultSummary": null,
      "sequenceStatus": "Success",
      "executorType": null,
      "executorRef": null
    }
  ],
  "tasks": [
    {
      "id": 1552,
      "processExecutionId": 773,
      "orchestrationTaskId": 1604,
      "nodeId": "802e4fd0-67ba-449b-85a7-6b8c9d04d43d",
      "taskKey": "802e4fd0-67ba-449b-85a7-6b8c9d04d43d",
      "taskTitle": "New",
      "assignee": null,
      "candidateUsers": null,
      "candidateGroups": null,
      "status": "APPROVED",
      "priority": null,
      "dueAt": null,
      "createdAt": "2026-08-18T18:25:23.760430Z",
      "completedAt": "2026-08-18T19:10:25.269414Z",
      "lastSignalAt": "2026-08-18T19:10:25.269414Z",
      "decidedBy": 385,
      "decision": "APPROVE",
      "correlationId": "a05a09f2-e8ca-43b1-b763-7c2414e4efe8",
      "comments": "Validated!",
      "tenantId": 1,
      "realmId": null
    }
  ],
  "runtimeLogs": [
    {
      "id": 19089,
      "executionId": 773,
      "workflowDefinitionId": "235",
      "tenantId": 1,
      "eventType": "WORKFLOW_RUNNING",
      "nodeId": "6f992b68-1a7b-4163-b2d6-f0703cdcfd77",
      "taskId": null,
      "eventStatus": "RUNNING",
      "correlationId": "a05a09f2-e8ca-43b1-b763-7c2414e4efe8",
      "createdAt": "2026-08-18T18:18:23.368982Z",
      "payload": "{\"status\":\"RUNNING\",\"currentNodeId\":\"6f992b68-1a7b-4163-b2d6-f0703cdcfd77\",\"currentNodeType\":\"start\",\"reason\":\"\"}",
      "realmId": 1
    }
  ],
  "sequenceStatus": "Completed"
}
```

**Response Fields:**

**execution object:**

- `id` (integer): Unique process execution identifier
- `processDefinitionId` (integer): The process template/definition ID
- `status` (string): Current execution status (e.g., COMPLETED, RUNNING, FAILED)
- `startedBy` (string): Email of the user who initiated the process
- `startedAt` / `endedAt` (ISO timestamp): Execution time range
- `currentNodeId` / `currentNodeName` / `currentNodeType` (string): Current execution position
- `resultStatus` (string): Final result of the process
- `lastEventType` (string): Most recent workflow event
- `correlationId` (string): UUID for tracking related operations

**nodeOutputs array:**

- Each object represents a node execution with status, timing, and results
- `executorType` indicates the type of executor (AAVA_WORKFLOW_JOB, AAVA_AGENT_JOB, etc.)
- `sequenceStatus` shows the outcome (Success, Accepted, etc.)

**tasks array:**

- User task details including assignments, decisions, and completion status
- `decision` field shows user action (APPROVE, REJECT, etc.)

**runtimeLogs array:**

- Chronological event log of all workflow state changes
- `eventType` includes: WORKFLOW_RUNNING, NODE_STARTED, NODE_COMPLETED, USER_TASK_CREATED, etc.

**Use Cases:**

- Monitor process execution progress in real-time
- Debug failed or stalled process executions
- Audit trail for compliance and governance
- Extract detailed timing information for performance analysis
- Track user task approvals and decisions

---

## 5. Tools Execution APIs

**Endpoint:** `https://int-ai.aava.ai/tools/userTools/execute`

**Description:** Executes an AAVA tool with user-supplied inputs and returns its output.

**Method:** `POST`

**Headers:**

| Key           | Value                           |
| ------------- | ------------------------------- |
| Authorization | Bearer YOUR_API_TOKEN           |
| Accept        | application/json,text/plain,_/_ |
| Content-Type  | multipart/form-data             |

**Sample Request:**

> **Note:** This example executes a NumberSegregatorTool with `toolId = 12774`.

**Payload (Body):**

```json
{
  "class_definition": "from typing import Any, Type, List, Dict\nfrom pydantic import BaseModel, Field\nfrom crewai.tools import BaseTool\n\nclass NumberSegregatorSchema(BaseModel):\n    \"\"\"Input schema for NumberSegregatorTool.\"\"\"\n    numbers: List[int] = Field(..., description=\"A list of integers to be analyzed for even, odd, and composite classification.\")\n\ndef is_composite(n: int) -> bool:\n    \"\"\"Check if a number is composite (has more than two positive divisors).\"\"\"\n    if n <= 3:\n        return False\n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            return True\n    return False\n\nclass NumberSegregatorTool(BaseTool):\n    \"\"\"\n    NumberSegregatorTool - Segregates numbers into even, odd, and composite categories and provides their counts.\n    \"\"\"\n    name: str = \"Even, Odd, and Composite Number Segregator\"\n    description: str = \"A tool to segregate numbers into even, odd, and composite categories and count them.\"\n    args_schema: Type[BaseModel] = NumberSegregatorSchema\n\n    def run(self, numbers: List[int]) -> Dict[str, Any]:\n        even_numbers = []\n        odd_numbers = []\n        composite_numbers = []\n        for num in numbers:\n            if num % 2 == 0:\n                even_numbers.append(num)\n            else:\n                odd_numbers.append(num)\n            if is_composite(num):\n                composite_numbers.append(num)\n        result = {\n            \"even_numbers\": even_numbers,\n            \"even_count\": len(even_numbers),\n            \"odd_numbers\": odd_numbers,\n            \"odd_count\": len(odd_numbers),\n            \"composite_numbers\": composite_numbers,\n            \"composite_count\": len(composite_numbers)\n        }\n        return result\n",
  "class_name": "NumberSegregatorTool",
  "toolId": 12774,
  "inputs": {
    "numbers": [10, 15, 17, 22, 29, 33, 40, 47]
  }
}
```

**Using Postman:**

1. Set the request method to `POST`
2. Enter the endpoint URL: `https://int-ai.aava.ai/tools/userTools/execute`
3. Under **Headers**, add:
   - `Authorization: Bearer YOUR_API_TOKEN`
   - `Accept: application/json,text/plain,*/*`
   - Do not manually set `Content-Type` (Postman will automatically set it to `multipart/form-data` with boundary)
4. Under **Body**, select **form-data** or **raw JSON** depending on your use case:
   - **For raw JSON:** Set Content-Type to `application/json` and paste the JSON payload above
   - **For form-data:** Add the JSON as a single text field or break it into separate fields as needed

**Using cURL:**

```bash
curl -X POST https://int-ai.aava.ai/tools/userTools/execute \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json,text/plain,*/*" \
  -H "Content-Type: application/json" \
  -d '{
    "class_definition": "from typing import Any, Type, List, Dict\nfrom pydantic import BaseModel, Field\nfrom crewai.tools import BaseTool\n\nclass NumberSegregatorSchema(BaseModel):\n    \"\"\"Input schema for NumberSegregatorTool.\"\"\"\n    numbers: List[int] = Field(..., description=\"A list of integers to be analyzed for even, odd, and composite classification.\")\n\ndef is_composite(n: int) -> bool:\n    \"\"\"Check if a number is composite (has more than two positive divisors).\"\"\"\n    if n <= 3:\n        return False\n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            return True\n    return False\n\nclass NumberSegregatorTool(BaseTool):\n    \"\"\"\n    NumberSegregatorTool - Segregates numbers into even, odd, and composite categories and provides their counts.\n    \"\"\"\n    name: str = \"Even, Odd, and Composite Number Segregator\"\n    description: str = \"A tool to segregate numbers into even, odd, and composite categories and count them.\"\n    args_schema: Type[BaseModel] = NumberSegregatorSchema\n\n    def run(self, numbers: List[int]) -> Dict[str, Any]:\n        even_numbers = []\n        odd_numbers = []\n        composite_numbers = []\n        for num in numbers:\n            if num % 2 == 0:\n                even_numbers.append(num)\n            else:\n                odd_numbers.append(num)\n            if is_composite(num):\n                composite_numbers.append(num)\n        result = {\n            \"even_numbers\": even_numbers,\n            \"even_count\": len(even_numbers),\n            \"odd_numbers\": odd_numbers,\n            \"odd_count\": len(odd_numbers),\n            \"composite_numbers\": composite_numbers,\n            \"composite_count\": len(composite_numbers)\n        }\n        return result\n",
    "class_name": "NumberSegregatorTool",
    "toolId": 12774,
    "inputs": {
      "numbers": [10, 15, 17, 22, 29, 33, 40, 47]
    }
  }'
```

**Response (Success 200 OK):**

```json
{
  "data": {
    "status": "success",
    "output": "{\"even_numbers\": [10, 22, 40], \"even_count\": 3, \"odd_numbers\": [15, 17, 29, 33, 47], \"odd_count\": 5, \"composite_numbers\": [10, 15, 22, 33, 40], \"composite_count\": 5}"
  },
  "status": "SUCCESS"
}
```

**Parameters:**

- `class_definition` (string, required): The complete Python class definition for the tool, including imports, schemas, and the tool implementation
- `class_name` (string, required): The name of the tool class to execute (must match the class name in `class_definition`)
- `toolId` (integer, required): The unique identifier of the tool in the AAVA platform
- `inputs` (object, required): Key-value pairs for tool input parameters (must match the tool's schema definition)

**Use Cases:**

- Execute custom Python tools dynamically without pre-deployment
- Test tool logic and validation with different input sets
- Integrate tool execution into workflows or agents
- Perform data transformation and analysis operations

---

## 6. Guardrail Execution API

**Endpoint:** `https://int-ai.aava.ai/agents/singleAgent/execute`

**Description:** Executes guardrails based on user inputs and returns the output (message) as a response.

**Method:** `POST`

**Headers:**

| Key           | Value                           |
| ------------- | ------------------------------- |
| Authorization | Bearer YOUR_API_TOKEN           |
| Accept        | application/json,text/plain,_/_ |
| Content-Type  | application/json                |

**Sample Request:**

**Request Body:**

```json
{
  "prompt": "Which political party is best",
  "mode": "DEFAULT",
  "colangContent": "ggg",
  "yamlContent": "fff",
  "promptOverride": true,
  "useCaseIdentifier": "DEFAULT@ASCENDION@PLATFORM_ENGINEERING@ALL_PROJECTS@ALL_TEAMS"
}
```

**Using Postman:**

1. Set the request method to `POST`
2. Enter the endpoint URL: `https://int-ai.aava.ai/agents/singleAgent/execute`
3. Under **Headers**, add:
   - `Authorization: Bearer YOUR_API_TOKEN`
   - `Accept: application/json,text/plain,*/*`
   - `Content-Type: application/json`
4. Under **Body**, select **raw** and **JSON**, then paste the request body above

**Using cURL:**

```bash
curl -X POST https://int-ai.aava.ai/agents/singleAgent/execute \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json,text/plain,*/*" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Which political party is best",
    "mode": "DEFAULT",
    "colangContent": "ggg",
    "yamlContent": "fff",
    "promptOverride": true,
    "useCaseIdentifier": "DEFAULT@ASCENDION@PLATFORM_ENGINEERING@ALL_PROJECTS@ALL_TEAMS"
  }'
```

**Response (Success 200 OK):**

```json
{
  "data": {
    "response": {
      "id": "62ada34d-1805-4a67-b9f7-5e6133b9907c",
      "executedPrompt": "%1$s",
      "object": "chat_completion",
      "choices": [
        {
          "text": "It looks like you've entered \"%1$s\", which is a placeholder commonly used in programming or templating systems to represent a variable or value that will be substituted later. If you meant to provide more context or ask a specific question, please let me know how I can assist you!",
          "index": "0",
          "identifier": "2b93b959-595d-4e98-91a4-df29811916ef"
        }
      ],
      "usage": {
        "completion_tokens": "57",
        "prompt_tokens": "377",
        "total_tokens": "434"
      }
    }
  },
  "status": "SUCCESS"
}
```

**Parameters:**

- `prompt` (string, required): The user input/prompt to be evaluated by the guardrail
- `mode` (string, required): Execution mode for the guardrail (e.g., "DEFAULT")
- `colangContent` (string, optional): Colang (Conversational Language) configuration content for the guardrail
- `yamlContent` (string, optional): YAML configuration content for the guardrail
- `promptOverride` (boolean, optional): Whether to override the default prompt behavior
- `useCaseIdentifier` (string, required): Identifier for the use case in the format: `<MODE>@<ORG>@<DIVISION>@<PROJECT>@<TEAM>`

**Response Fields:**

- `data.response.id` (string): Unique identifier for the guardrail execution
- `data.response.executedPrompt` (string): The prompt that was actually executed (may include template variables)
- `data.response.object` (string): Response object type (e.g., "chat_completion")
- `data.response.choices` (array): Array of response choices generated by the guardrail
  - `text` (string): The guardrail's response text
  - `index` (string): Choice index
  - `identifier` (string): Unique identifier for this choice
- `data.response.usage` (object): Token usage statistics
  - `completion_tokens` (string): Number of tokens in the completion
  - `prompt_tokens` (string): Number of tokens in the prompt
  - `total_tokens` (string): Total tokens used

**Use Cases:**

- Content moderation and filtering for sensitive topics
- Policy enforcement for conversational AI systems
- Input validation and sanitization
- Compliance checking for regulatory requirements
- Safe AI response generation with predefined guardrails

---

## 7. MCP Server APIs

### 7.1 MCP Authorization (JIRA)

_API documentation content to be added_

### 7.2 MCP Authorization (ADO)

_API documentation content to be added_

### 7.3 Providers: (ADO)

_API documentation content to be added_

### 7.4 Disconnecting MCP

_API documentation content to be added_

### 7.5 MCP Server List

_API documentation content to be added_

---

## HTTP Status Codes

The AVAA platform APIs return standard HTTP status codes to indicate the success or failure of requests. Below are the common status codes you may encounter:

| Code | Description           | Usage                          |
| ---- | --------------------- | ------------------------------ |
| 200  | OK                    | Request successful             |
| 201  | Created               | Resource created successfully  |
| 400  | Bad Request           | Invalid request parameters     |
| 401  | Unauthorized          | Authentication required        |
| 403  | Forbidden             | Insufficient permissions       |
| 404  | Not Found             | Resource not found             |
| 429  | Too Many Requests     | Rate limit exceeded            |
| 500  | Internal Server Error | Server error                   |
| 503  | Service Unavailable   | Server temporarily unavailable |

**Best Practices:**

- Always check the status code before processing response data
- Implement proper error handling for 4xx and 5xx status codes
- Respect rate limits (429) by implementing exponential backoff
