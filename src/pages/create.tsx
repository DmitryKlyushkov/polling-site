import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateInputQuestionType,
  createQuestionValidator,
} from "../shared/create-question-validator";

const CreateQuestionForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInputQuestionType>({
    resolver: zodResolver(createQuestionValidator),
  });

  const { mutate, isLoading, data } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      router.push(`/question/${data.id}`);
    },
  });

  if (isLoading || data) return <div>Loading...</div>;

  return (
    <div className="antialiased text-gray-100 px-6">
      <div className="max-w-xl mx-auto py-12 md:max-w-4xl">
        <h2 className="text-2xl font-bold">Reset styles</h2>
        <p className="mt-2 text-lg text-gray-100">
          These are form elements this plugin styles by default.
        </p>
        <form
          onSubmit={handleSubmit((data) => {
            mutate(data);
          })}
        >
          <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6 items-start">
            <div className="grid grid-cols-1 gap-6">
              <label className="block">
                <span className="text-gray-200">Question</span>
                <input
                  {...register("question")}
                  type="text"
                  className="form-input mt-1 block w-full text-gray-800"
                  placeholder="How do magnets work?"
                />
              </label>
              {errors.question && (
                <p className="text-red-400">{errors.question.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6">
              <label className="block">
                <input
                  type="submit"
                  className="form-input mt-1 text-gray-800"
                  value="Create question"
                />
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const QuestionCreator: React.FC = () => {
  const client = trpc.useContext();
  const inputRef = useRef<HTMLInputElement>(null);

  return <CreateQuestionForm />;
};

export default QuestionCreator;
