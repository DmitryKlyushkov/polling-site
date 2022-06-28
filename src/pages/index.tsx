import type { NextPage } from "next";
import Link from "next/link";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.get-all-my-questions"]);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold">Your questions</div>
      <div>
        {data.map((question) => {
          return (
            <div className="flex flex-col my-2" key={question.id}>
              <Link href={`/question/${question.id}`}>
                <a>
                  <div className="my-2">{question.question}</div>
                </a>
              </Link>
              <span>Created on {question.createdAt.toDateString()}</span>
            </div>
          );
        })}
      </div>
      <Link href="/create">
        <a>Create New Question</a>
      </Link>
    </div>
  );
};

export default Home;
