import { AsteraiClient } from "@asterai/client";
// import { v4 as uuidv4 } from 'uuid';
import {useEffect, useState} from "react";

/**
 * To set these values:
 * 1. Create an asterai account and sign in to the dashboard.
 * 2. Create an asterai agent
 * 3. Go to the plugin marketplace tab, and click to add
 *    the "Coinbase Wallet" and "Dexscreener" plugins.
 * 4. Copy the app (agent) ID and public query ID.
 */
const ASTERAI_APP_ID = "323f9a2d-adec-4617-b553-4c52b64e34df";
// TODO remove placeholder (rotate)
const ASTERAI_PUBLIC_QUERY_KEY = "03721d79-e718-4d57-a56c-7836b0320a7a";
// const CONVERSATION_ID = uuidv4();

const client = new AsteraiClient({
  appId: ASTERAI_APP_ID,
  queryKey: ASTERAI_PUBLIC_QUERY_KEY,
});

export const App = () => {
  const [state, setState] = useState<State>();
  useEffect(() => {
    fetchState().then(setState).catch(console.error);
  }, []);
  return (
    <div className="w-full">
      <header
        className="
          w-full bg-amber-300 border-b-2 border-amber-200 block
          p-12 flex justify-center text-4xl color-white
        "
      >
          🤖 Based asterai Agent
      </header>
      <div className="w-11/12 md:w-2/3 flex justify-center py-12 px-3 flex-wrap m-auto">
        { !state && (
          <div className="w-full text-center">
            <p>
              preparing & loading data from agent...
            </p>
            <br />
            <img
              className="inline"
              alt="loading"
              width="50px"
              src="https://cdn.pixabay.com/animation/2023/05/02/04/29/04-29-06-428_512.gif"
            />
          </div>
        ) }
        { state && (
          <>
            <Card name="agent's wallet address" value={state.address} />
            <Card name="agent's ETH balance" value={state.ethBalance} />
          </>
        ) }
      </div>
    </div>
  )
};

type CardProps = {
  value: string;
  name: string;
};

const Card = ({ value, name }: CardProps) => (
  <div className="w-full basis-full border-2 border-stone-400 my-2 rounded-xl">
    <div className="p-3 text-xl truncate text-center">
      { value }
    </div>
    <div className="bg-stone-400 p-4 text-sm text-stone-800 rounded-b text-center">
      { name }
    </div>
  </div>
);

// const executeQuery = async (
//   query: string,
//   setResponse: (v: string) => void,
// ) => {
//   if (query.length > 1000) {
//     query = query.substring(0, 1000);
//   }
//   const response = await client.query({
//     query,
//     conversationId: CONVERSATION_ID
//   });
//   let llmResponse = "";
//   response.onToken((t) => {
//     llmResponse += t;
//     setResponse(llmResponse);
//   });
// };

type State = {
  address: string;
  ethBalance: string;
};

const getFetchStatePrompt = (item: string) =>
  `Return the ${item} as plain text and nothing else.`;

const fetchState = async (): Promise<State> => {
  await new Promise(r => setTimeout(r, 1000));
  // TODO remove debug state.
  return {
    address: "0xD49088c6A8ADBBDBD743e8f57dbb34B6ADE3162A",
    ethBalance: "0.0001"
  };
  const [address, ethBalance] = await Promise.all([
    fetchAddress(),
    fetchBalance()
  ]);
  return {
    address: address.trim(),
    ethBalance: ethBalance.trim()
  }
};

const fetchAddress = () =>
  client.query({
    query: getFetchStatePrompt("ETH wallet address")
  }).then(response => response.text());

const fetchBalance = () =>
  client.query({
    query: getFetchStatePrompt("ETH balance rounded to 4 decimals")
  }).then(response => response.text());
