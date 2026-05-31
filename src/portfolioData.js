export const SITE_DATA = {
  aboutMe: `I am a passionate Full-Stack AI Engineer bridging the gap between heavy machine learning backends and premium front-end experiences. 

I prefer spending days to automate a 5-second task, but hey! Now I don't have to do it manually! WIN.`,

  links: {
    github: "https://github.com/Brintik",
    linkedin: "https://www.linkedin.com/in/brintikmajumder/",
    kaggle: "https://www.kaggle.com/brintikmajumder",
    email: "brintikmajumder@gmail.com",
    resume: "/data/resume.pdf"
  },

  projects: [
    {
      id: "project-11",
      title: "AI Image Recognizer",
      shortDesc: `A full-stack, decoupled machine learning pipeline. 

It processes raw images through a custom YOLOv8 neural network and maps the coordinates directly into a React UI.`,
      image: "/data/projects/image-recognizer.jpg",
      websiteUrl: "https://your-live-app.com",
      readMoreUrl: "/projects/ai-image-recognizer",
      tags: ["React", "Tailwind", "Python", "YOLOv8"] // <-- ADD YOUR TAGS HERE
    },
    {
      id: "project-12",
      title: "Model Ship Project",
      shortDesc: `A 3D rendering pipeline demonstrating advanced WebGL and Three.js physics capabilities directly in the browser.`,
      image: "/data/projects/model-ship.jpg",
      websiteUrl: "https://your-live-app.com",
      readMoreUrl: "/projects/model-ship",
      tags: ["Three.js", "WebGL", "JavaScript"] // <-- ADD YOUR TAGS HERE
    }
  ]
};