import CreateArticle from "../../components/CreateArticle";
import { useNavigate } from "react-router-dom";

export default function CreateArticleAdmin() {
  const navigate = useNavigate();
  const onSaved = () => navigate("/admin");
  return <CreateArticle onSaved={onSaved} />;
}
