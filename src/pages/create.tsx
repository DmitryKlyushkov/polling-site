import React, { useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { trpc } from "../utils/trpc";

type Inputs = {
  example: string;
  exampleRequired: string;
};

const CreateQuestionForm = () => {
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {},
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    <div className="antialiased text-gray-100 px-6">
      <div className="max-w-xl mx-auto py-12 md:max-w-4xl">
        <h2 className="text-2xl font-bold">Reset styles</h2>
        <p className="mt-2 text-lg text-gray-100">
          These are form elements this plugin styles by default.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6 items-start">
            <div className="grid grid-cols-1 gap-6">
              <label className="block">
                <span className="text-gray-200">Question</span>
                <input
                  type="text"
                  className="form-input mt-1 block w-full text-gray-800"
                  placeholder="How do magnets work?"
                />
              </label>
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

export default QuestionCreator;
