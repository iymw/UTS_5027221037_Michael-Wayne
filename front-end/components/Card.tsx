"use client";
import { getAnswer, submitAnswer } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface AnswerProps {
  id: string;
  answer: string;
}

import { FiThumbsUp } from "react-icons/fi";
const Card = () => {
  const router = useRouter();
  const [data, setData] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const trigger = () => {
    setModal(!modal);
  };

  const methods = useForm<AnswerProps>();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = methods;

  setValue("id", "f8279ab4-6503-4340-be48-8c3a59af28d3");
  const onSubmit: SubmitHandler<AnswerProps> = async (data) => {
    try {
      const res = await submitAnswer(data);
      location.reload();
      console.log(res.data);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const id = "f8279ab4-6503-4340-be48-8c3a59af28d3";
        const res = await getAnswer(id);
        setData(res.data.answer);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  return (
    <>
      <div className="p-4">
        {/* Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="space-y-2 shadow-2xl rounded-md p-6">
            <div className="flex justify-between">
              <div>General Skills</div>
              <div>100 points</div>
            </div>
            <div className="text-3xl font-bold">Serpentine</div>
            <div className="flex justify-between">
              <div>30,000 solves</div>
              <div className="flex gap-2 items-center">
                100% <FiThumbsUp />
              </div>
            </div>
            <br />
            {data === "sup3r_s3cr3t_passw0rd" ? (
              <>
                <button disabled className="btn btn-neutral" onClick={trigger}>
                  Solved
                </button>
                <br />
                <div>Great job!</div>
              </>
            ) : data === "default_1" ? (
              <>
                <button className="btn btn-neutral" onClick={trigger}>
                  Solve
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-neutral" onClick={trigger}>
                  Solve Again
                </button>
                <br />
                <div>Your previous answer isn't correct</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog className={`${modal ? "modal-open" : ""} modal`}>
        <div className="modal-box open">
          <h3 className="font-bold text-lg">Serpentine</h3>
          <p className="py-4">Find the flag in the Python script!</p>
          <Link href="/" className="text-blue-700">
            Download Python script
          </Link>
          <br />
          <br />
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              {...register("id", { required: true })}
              disabled
            />
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs mt-2"
              {...register("answer", { required: true })}
            />
            <div className="mt-2">
              {errors.answer && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <button className="btn btn-info mt-3">Submit</button>
          </form>
          <div className="modal-action">
            <button className="btn" onClick={trigger}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Card;
