import { createContext } from "react";

const FFLayersContext = createContext({
    layers: [],
    setLayers: () => {}
});

export default FFLayersContext