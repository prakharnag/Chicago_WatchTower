import {db} from '../Authentication/firebase'
import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";


function fetchdata (){
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const queryRef = ref(db, "watchTower");
      try {
        const snapshot = await get(queryRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const projectsArray = Object.values(data);
          setProjects(projectsArray);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

  }, []);

  return (
    <div className={Styles.projects}>
      {projects.map((project, index) => (
        <Project {...project} key={index} />
      ))}
    </div>
  );
}

export default fetchdata;