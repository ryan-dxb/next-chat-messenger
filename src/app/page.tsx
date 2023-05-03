import { NextPage } from "next";
import Button from "./components/ui/Button";

interface HomeProps {}

const Home: NextPage<HomeProps> = () => {
  return (
    <main className="mr-2">
      <Button>
        <h1>Home</h1>
      </Button>
    </main>
  );
};

export default Home;
