import type { NextPage } from "next";

import { trpc } from "../utils/trpc";

const QuestionCreator: React.FC = () => {
  const { mutate } = trpc.useMutation("questions.create");

  return (
    <input
      onSubmit={(e) => {
        console.log(e.currentTarget.value);
      }}
    />
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.get-all"]);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold">Questions</div>
      <div>{data[0]?.question}</div>
      <QuestionCreator />
    </div>
  );
};

export default Home;
