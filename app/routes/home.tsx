import type { Route } from "./+types/home";
import styles from "./home.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Empty Template" },
    {
      name: "description",
      content: "A welcoming empty template ready for content generation",
    },
  ];
}

export default function Home() {
  return <main className={styles.home}>I'm an empty template.</main>;
}
