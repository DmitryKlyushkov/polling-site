import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
    control,
  } = useForm<CreateInputQuestionType>({
    resolver: zodResolver(createQuestionValidator),
    defaultValues: {
      options: [{ text: "Yes" }, { text: "No" }],
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fields, append, prepend, remove, swap, move, insert } =
    useFieldArray<CreateInputQuestionType>({
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "options", // unique name for your Field Array
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
        <h2 className="text-2xl font-bold">Create a new poll</h2>
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
            <div className="grid grid-cols-2 gap-6">
              {fields.map((field, index) => {
                return (
                  <div key={field.id}>
                    <section className={"section"} key={field.id}>
                      <input
                        type="text"
                        {...register(`options.${index}.text` as const, {
                          required: true,
                        })}
                        className="w-full text-gray-400"
                      />
                      <button type="button" onClick={() => remove(index)}>
                        DELETE
                      </button>
                    </section>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => append({ text: "another option" })}
            >
              Add options
            </button>
            <div>
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
  return <CreateQuestionForm />;
};

export default QuestionCreator;
