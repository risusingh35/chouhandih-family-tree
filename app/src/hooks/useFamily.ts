import { useEffect, useState } from "react";

export const useFamily = () => {
  const [data, setData] = useState<any>({ persons: [] });

  useEffect(() => {
    const local = localStorage.getItem("family");

    if (local) {
      setData(JSON.parse(local));
    } else {
      fetch("/data/family.json")
        .then(res => res.json())
        .then(setData);
    }
  }, []);

  const save = (newData: any) => {
    setData(newData);
    localStorage.setItem("family", JSON.stringify(newData));
  };

  return { data, save };
};