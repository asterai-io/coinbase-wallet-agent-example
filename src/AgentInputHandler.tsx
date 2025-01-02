import {useState} from "react";
import {v4 as uuidv4} from "uuid";
import {client} from "./App.tsx";

const CONVERSATION_ID = uuidv4();

export const AgentInputOutputHandler = () => {
  const [response, setResponse] = useState(
    "Hello! How can I assist you today?"
  );
  const [input, setInput] = useState("");
  const handleSubmit = () => {
    setInput("");
    setResponse("...");
    executeQuery(input, setResponse).catch(console.error);
  };
  return (
    <div
      className="w-full basis-full my-2 rounded-xl"
    >
      <p className="my-4 text-stone-500 w-full text-center">
        Talk to your agent using the input below. <br/>
        Examples: fetch news, check token balances, transfer ETH.
      </p>
      <div className="w-full flex items-center justify-center relative rounded-xl">
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            className="
              p-6 text-2xl rounded-t-xl w-full bg-stone-800 border-2
              border-stone-700 hover:border-stone-600 placeholder-stone-500
              text-white
            "
            type="text"
            placeholder="your message here"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </form>
      </div>
      <div
        className="
          w-full flex items-center justify-center p-6 bg-stone-400
          rounded-b-xl
        "
      >
        <h1
          className="text-xl overflow-y-auto text-md text-stone-900"
          style={{maxHeight: "300px"}}
        >{response}</h1>
      </div>
    </div>
  )
};

const executeQuery = async (
  query: string,
  setResponse: (v: string) => void,
) => {
  if (query.length > 1000) {
    query = query.substring(0, 1000);
  }
  const response = await client.query({
    query,
    conversationId: CONVERSATION_ID
  });
  let llmResponse = "";
  response.onToken((t) => {
    llmResponse += t;
    setResponse(llmResponse);
  });
};
