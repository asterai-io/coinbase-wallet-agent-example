import { AsteraiClient } from "@asterai/client";
import { useEffect, useState } from "react";
import { AgentInputOutputHandler } from "./AgentInputHandler.tsx";
import { Card } from "./Card.tsx";

/**
 * To set these values:
 * 1. Create an asterai account and sign in to the dashboard.
 * 2. Create an asterai agent
 * 3. Go to the plugin marketplace tab, and click to add
 *    the "Coinbase Wallet", "News" and "Dexscreener" plugins.
 * 4. Copy the app (agent) ID and public query ID.
 */
const ASTERAI_APP_ID = "323f9a2d-adec-4617-b553-4c52b64e34df";
// TODO remove placeholder (rotate)
const ASTERAI_PUBLIC_QUERY_KEY = "03721d79-e718-4d57-a56c-7836b0320a7a";

export const client = new AsteraiClient({
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
          🤖 asterai's Based Agent
      </header>
      <div className="w-11/12 md:w-2/3 flex justify-center py-12 px-3 flex-wrap m-auto">
        { !state && <Loader /> }
        { state && (
          <>
            <Cards state={state} />
            <AgentInputOutputHandler />
          </>
        ) }
      </div>
    </div>
  )
};

const Loader = () => (
  <div className="w-full text-center">
    <p>
      setting up & fetching data from agent...
    </p>
    <br/>
    <img
      className="inline"
      alt="loading"
      width="50px"
      src="https://cdn.pixabay.com/animation/2023/05/02/04/29/04-29-06-428_512.gif"
    />
  </div>
);

type StateProps = {
  state: State;
}

const Cards = ({ state }: StateProps) => (
  <>
    <Card name="agent's wallet address" value={state.address} />
    <Card name="agent's ETH balance" value={state.ethBalance} />
  </>
);

type State = {
  address: string;
  ethBalance: string;
};

const getFetchStatePrompt = (item: string) =>
  `Return the ${item} as plain text and nothing else.`;

const fetchState = async (): Promise<State> => {
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
