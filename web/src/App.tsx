import { AsteraiClient } from "@asterai/client";
import { OrbitControls } from "@react-three/drei";
import {Canvas, useFrame} from "@react-three/fiber";
import {
  InstancedRigidBodies,
  Physics,
  RapierRigidBody
} from "@react-three/rapier";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";

const YEET_POWER = 69;
const ASTERAI_APP_ID = "a3d9cb1d-d70e-455b-b329-dc208026fb77";
const ASTERAI_PUBLIC_QUERY_KEY = "d466c3d6-b54d-4459-9556-45b6c2df899f";

const client = new AsteraiClient({
  appId: ASTERAI_APP_ID,
  queryKey: ASTERAI_PUBLIC_QUERY_KEY,
  // appProtos: [],
});

export const App = () => {
  const [initFlag, setInitFlag] = useState(false);
  const [yeetFlag, setYeetFlag] = useState(false);
  const init = useCallback(() => {
    setInitFlag(v => !v);
  });
  const yeet = useCallback(() => {
    setYeetFlag(v => !v);
  });
  return (
    <div className="w-full text-neutral-200">
      <QueryHandler init={init} yeet={yeet} />
      <Scene initFlag={initFlag} yeetFlag={yeetFlag} />
    </div>
  )
};

type QueryHandleProps = {
  init: () => void;
  yeet: () => void;
}

const QueryHandler = ({ init, yeet }: QueryHandleProps) => {
  const [response, setResponse] = useState("...");
  const [input, setInput] = useState("");
  const handleSubmit = (e) => {
    e?.preventDefault?.();
    setInput("");
    setResponse("...");
    executeQuery(input, init, yeet, setResponse).catch(console.error);
  };
  return (
    <header className="p-14 h-80 bg-neutral-800 relative">
      <div className="w-full flex items-center justify-center relative">
        <form
          className="w-full"
          onSubmit={handleSubmit}
        >
          <input
            className="
              p-6 text-3xl rounded-xl w-full bg-slate-800 border-2
              border-slate-700 hover:border-slate-600 placeholder-slate-700
            "
            type="text"
            placeholder="your yeet request here..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </form>
        <span className="absolute bottom-24 text-slate-400 right-0">
          press enter/submit to send
        </span>
      </div>
      <div className="w-full flex items-center justify-center mt-8">
        <h1
          className="text-xl overflow-y-auto"
          style={{ height: "73px" }}
        >{ response }</h1>
      </div>
      <div className="w-full flex justify-center mt-4 text-yellow-400/60">
        <a
          className="text-inherit no-underline"
          href="https://asterai.io"
          target="_blank"
        >
          build your agent with asterai.io
        </a>
      </div>
    </header>
  );
}

const executeQuery = async (
  query: string,
  init: () => void,
  yeet: () => void,
  setResponse: (v: string) => void,
) => {
  if (query.length > 1000) {
    query = query.substring(0, 1000);
  }
  const response = await client.query({ query });
  let llmResponse = "";
  response.onToken((t) => {
    llmResponse += t;
    setResponse(llmResponse);
  });
};

const Scene = (props: YeeterProps) => {
  return (
    <div
      className="absolute right-0 bottom-0 left-0"
      style={{ top: "260px" }}
    >
      <Canvas camera={{
        fov: 60,
        position: [-3, 1.5, -3],
      }}>
        <OrbitControls />
        <ambientLight intensity={Math.PI / 2}/>
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={0.5}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight
          position={[-10, -10, -10]}
          decay={0.25}
          intensity={Math.PI}
        />
        {/*<Box/>*/}
        <DoubleSidedPlane/>
        <Yeeter {...props} />
      </Canvas>
    </div>
  )
};

const Box = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    // ref.current.position.x += delta;
    // ref.current.body.applyImpulse({ x: 2, y: 0, z: 0 })
    // (ref.current.rotation.x += delta)
  });
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
      position={[0, 0.5001, 0]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
};

const DoubleSidedPlane = () => {
  const length = 250;
  return (
    <>
      <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2}  scale={1}>
        <planeGeometry args={[length, length]} />
        <meshStandardMaterial color={"green"} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation-x={Math.PI / 2} scale={1}>
        <planeGeometry args={[length, length]} />
        <meshBasicMaterial color="green" />
      </mesh>
    </>
  );
};

const degToRad = (deg: number): number =>
  deg * Math.PI/180;


type YeeterProps = {
  initFlag: boolean;
  yeetFlag: boolean;
}

const Yeeter = ({ initFlag, yeetFlag }: YeeterProps) => {
  const cubes = useRef();
  const cubeCount = 1;
  const [totalYeets, setTotalYeets] = useState(0);
  const rigidBodies = useRef<(RapierRigidBody | null)>();
  const instances = useMemo(() => {
    const objects = [];
    for (let i = 0; i < cubeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.25;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      objects.push({
        key: "instance_" + i,
        position: [x, 0.5, z],
        rotation: [0, 0, 0],
      });
    }
    return objects;
  }, [initFlag]);
  useEffect(() => {
    if (totalYeets === 0 && !yeetFlag) {
      // Wait for yeet instead of yeeting on first init.
      return;
    }
    const cubeCount = rigidBodies.current.length;
    const lastCube = rigidBodies.current[cubeCount - 1];
    lastCube?.applyImpulse(
      {
        x: YEET_POWER,
        y: Math.random() * YEET_POWER / 3,
        z: YEET_POWER,
      },
      true
    );
    setTotalYeets(v => v + 1);
  }, [yeetFlag])
  return (
    <>
      <Physics>
        <InstancedRigidBodies
          instances={instances}
          type="dynamic"
          gravityScale={0}
          ref={rigidBodies}
          canSleep={false}
        >
          <instancedMesh
            ref={cubes}
            args={[null, null, cubeCount]}
            dispose={null}
            onClick={(e) => {
              if (!rigidBodies.current) {
                return;
              }
              e.stopPropagation();
              let rigidBody = rigidBodies.current[e.instanceId];
              rigidBody?.applyImpulse(
                {
                  x: YEET_POWER,
                  y: Math.random() * YEET_POWER / 3,
                  z: YEET_POWER,
                },
                true
              );
            }}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              metalness={0.5}
              roughness={0.5}
              transparent={true}
              opacity={1}
              color={0xe1bd9400}
            />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
      <pointLight position={[0, 0, 25]} intensity={80.25} color={0xff0000} />
      <pointLight position={[0, 0, 0]} intensity={80.75} color={0xffffff} />
      <pointLight position={[0, 0, 50]} intensity={80.25} color={0xffffff} />
      <pointLight position={[0, 0, 75]} intensity={80.75} color={0xffffff} />
    </>
  );
}
