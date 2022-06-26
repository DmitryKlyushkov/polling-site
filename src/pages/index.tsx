import type { NextPage } from "next";
import Link from "next/link";
import { useRef } from "react";

import { trpc } from "../utils/trpc";

const QuestionCreator: React.FC = () => {
  const client = trpc.useContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: () => {
      client.invalidateQueries(["questions.get-all-my-questions"]);
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
  const { data, isLoading } = trpc.useQuery(["questions.get-all-my-questions"]);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold">Questions</div>
      <div>
        {data.map((question) => {
          return (
            <Link href={`/question/${question.id}`} key={question.id}>
              <a>
                <div className="my-2">{question.question}</div>
              </a>
            </Link>
          );
        })}
      </div>
      <QuestionCreator />
    </div>
  );
};

export default Home;
