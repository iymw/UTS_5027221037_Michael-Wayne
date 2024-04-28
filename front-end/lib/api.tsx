import axios from "axios";

interface AnswerProps {
  id: string;
  answer: string;
}

export const submitAnswer = async (data: AnswerProps) => {
  const res = await axios.post("http://localhost:5000/update", data);
  return res.data;
};

export const getAnswer = async (id: string) => {
  const res = await axios.get(`http://localhost:5000/${id}`);
  return res.data;
};
