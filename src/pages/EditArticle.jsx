import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateArticle from "../components/CreateArticle";
import { newsArticleApi } from "../api/newsArticleApi";

export default function EditArticle() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await newsArticleApi.getById(id);
        // res is ApiResponse wrapper, DTO is res.data
        setInitialData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  const onSaved = (res) => {
    // After save redirect to admin dashboard
    navigate("/admin");
  };

  return (
    <CreateArticle articleId={id} initialData={initialData} onSaved={onSaved} />
  );
}
