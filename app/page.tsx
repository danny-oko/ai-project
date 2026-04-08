import Genai from "./models/genai";
import GeneratePage from "./models/image";

const page = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      {/* <Genai /> */}
      <GeneratePage />
    </div>
  );
};

export default page;
