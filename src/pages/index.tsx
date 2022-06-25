import type { NextPage } from "next";
import { useRef } from "react";

import { trpc } from "../utils/trpc";

const QuestionCreator: React.FC = () => {
  const client = trpc.useContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: () => {
      client.invalidateQueries(["questions.get-all"]);
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
  });

  return (
    <input
      ref={inputRef}
      disabled={isLoading}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          mutate({ question: e.currentTarget.value });
        }
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
      <div>
        {data.map((question) => {
          return (
            <div key={question.id} className="my-2">
              {question.question}
            </div>
          );
        })}
      </div>
      <QuestionCreator />
    </div>
  );
};

export default Home;
