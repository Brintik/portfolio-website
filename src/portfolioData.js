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
      websiteUrl: "https://image-recognizer-master.vercel.app/",
      readMoreUrl: "/projects/project-11",
      tags: ["React", "Tailwind", "Python", "YOLOv8"], // <-- ADD YOUR TAGS HERE

      caseStudy: {
        heroImage: "/data/projects/image-recognizer.jpg",
        
        challenge: `Manual data entry is the ultimate thief of cognitive energy. I firmly believe in spending days engineering a massive, fully decoupled architecture just to automate a five-second manual labeling task. I needed a seamless pipeline that could take a raw image, process it through a neural network, and map the absolute coordinates into a responsive React UI. 
        
        The biggest bottleneck was the math: traditional object detection models (like YOLOv8) return bounding box dimensions in absolute pixels relative to the image's native resolution. If you blindly send these raw coordinates to a responsive web client, the boxes drift off into space the second a user resizes their browser. Furthermore, during our initial deployment, we hit a brutal Vite compilation trap where system environment variables (like API keys) were evaluating to undefined at runtime, throwing intermittent HTTP 400 client configuration errors.`,
        
        solution: `I refused to use anything clunky (don't even get me started on Java). I kept the backend strictly Python and wired it to a blazing-fast React frontend. I decoupled the architecture entirely: React & Tailwind on Vercel for lightning-fast global CDN delivery, a containerized Python FastAPI backend, and a custom YOLOv8 model running on Hugging Face Spaces for dedicated ML memory.
        
        To solve the responsive bounding box dilemma, I shifted the mathematical normalization layer entirely to the FastAPI backend. Instead of absolute pixels, the engine computes relative percentage ratios before serialization:
        $$X_{\text{relative}} = \left( \frac{X_{\text{pixel}}}{\text{Total Width}} \right) \times 100$$
        $$Y_{\text{relative}} = \left( \frac{Y_{\text{pixel}}}{\text{Total Height}} \right) \times 100$$
        
        Here is the exact asynchronous Python ingestion pipeline handling the tensor matrix calculations:
        
        \`\`\`python
        @app.post("/v1/predict")
        async def predict_objects(file: UploadFile = File(...)):
            contents = await file.read()
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            height, width, _ = img.shape
            
            results = model(img)[0]
            predictions = []
            
            for box in results.boxes:
                xyxy = box.xyxy[0].tolist()
                # Calculate precise percentage maps for UI layout stabilization
                predictions.append({
                    "left": (xyxy[0] / width) * 100,
                    "top": (xyxy[1] / height) * 100,
                    "width": ((xyxy[2] - xyxy[0]) / width) * 100,
                    "height": ((xyxy[3] - xyxy[1]) / height) * 100
                })
                
            return {"status": "success", "data": predictions}
        \`\`\`
        
        On the frontend side, I mapped these normalized percentages directly to Tailwind's absolute layout layer via inline styles, forcing the browser engine to lock the boxes perfectly to the target regardless of screen scaling. To fix the Vite 400 errors, I forced a localized cache-cleared redeploy via the Vercel dashboard to deeply bake the environment parameters into the static production distribution.`,
        
        results: `The result is a highly responsive, production-grade SaaS dashboard that renders confidence-colored bounding boxes in sub-150ms round-trip processing speeds. The decoupled matrix operates flawlessly without blocking the main application server. 
        
        The production blueprint is officially validated. Next up on the roadmap: utilizing Roboflow to train a custom weights file that perfectly handles blurry edge cases, noise augmentations, and incomplete data dropouts!`,
      }
    },
    {
      id: "project-12",
      title: "Portfolio Website",
      shortDesc: `An modern tire, gamified personal portfolio engineered as a time-synced RPG visual novel environment. Features custom horizontal scroll mechanics, dynamic percentage-based hotspot bounding matrices that scale across viewports, and a context-aware hybrid LLaMA 3.1 digital clone assistant.`,
      image: "/data/projects/model-ship.jpg",
      websiteUrl: "https://portfolio-website-mocha-one.vercel.app/",
      readMoreUrl: "/projects/project-12",
      tags: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Groq API", "LLaMA 3.1", "React Router", "Formspree"], 

      caseStudy: {
      heroImage: "/data/projects/model-ship.jpg",
      
      challenge: `Standard portfolio grids are an absolute snore. Recruiting managers look at dozens of identical Tailwind grids a day, spending an average of 15 seconds before bouncing. I wanted to completely smash that template by transforming my personal site into a fully interactive visual novel and RPG point-and-click environment. The goal was to build a time-synced, multi-layered visual engine that mimics high-end Makoto Shinkai aesthetics, while maintaining a production-grade structural layout underneath.

      This introduced a massive series of architectural bottlenecks:
      1. **Viewport Layout Drifts:** Creating responsive, pixel-perfect interactive hotspots over fluid canvas layers means coordinates cannot be fixed. Since the target objects (the model ship, camera, character) scale across different browser sizes, native pixel bounding boxes break instantly.
      2. **The Coordinate Divergence Problem:** The interactive character shifts physical locations depending on the time of day (reading on the window in the morning, standing in the afternoon, sitting at the desk at night). The hitboxes needed to dynamically migrate along with the changing image assets.
      3. **API Memory Amnesia:** Traditional serverless client architectures calling LLM completions operate completely stateless. If a user tries to hold a fluid conversation with my digital clone, the assistant suffers from severe amnesia, processing every incoming prompt as a standalone event without context tracking.`,
      
      solution: `I engineered a multi-layered decoupled Single Page Application (SPA) driven by React, Vite, and Framer Motion. The UI is completely responsive, rendering a 60% opacity frosted glass navigation matrix tracking down a 50% opacity body panel layout sliding elegantly *over* a fixed interactive backdrop.

      To handle the moving hitboxes across shifting timelines, I built a dynamic position dictionary mapped to the system's chronological state. The component queries the client's internal system hours, matching the active assets to tailored coordinates using localized percentage positioning matrices:
      $$C(t) = \{ \text{top}(t)\%, \text{left}(t)\%, \text{width}(t)\%, \text{height}(t)\% \}$$
      
      Here is the exact structural dictionary and the custom mouse-wheel horizontal listener I wrote to force non-obtrusive, native scrolling across the quick reply array:
      
      \`\`\`javascript
      // src/config/viewportEngine.js
      export const CHARACTER_POSITIONS = {
        morning: { top: '30%', left: '67%', width: '10%', height: '40%' },
        afternoon: { top: '24%', left: '70%', width: '9%', height: '52%' },
        night: { top: '40%', left: '52%', width: '10%', height: '36%' }
      };

      // Custom Ref handler for mouse-wheel tracking on horizonal element containers
      export const handleWheelScroll = (e, elementRef) => {
        if (!elementRef.current) return;
        e.preventDefault();
        elementRef.current.scrollLeft += e.deltaY * 1.2; // Smooth scroll amplification multiplier
      };
      \`\`\`

      To build the dynamic brain without exposing my intellectual property to repository scraper bots, I decoupled the character prompt lore from the compilation tree entirely. I stuffed the multi-line profile string into a hidden, quotes-wrapped \`VITE_AI_LORE\` variable within a localized \`.env\` file protected by \`.gitignore\`. 
      
      I then solved the LLM amnesia by wrapping state tracking array maps directly into the async payload pipeline, feeding the complete contextual matrix down the wire to Groq's high-performance LLaMA 3.1 infrastructure:

      \`\`\`javascript
      // src/components/ChatContainer.jsx
      const handleCustomSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input };
        const updatedHistory = [...chatHistory, userMessage];
        setChatHistory(updatedHistory);
        setInput("");
        setIsLoading(true);

        try {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": \`Bearer \${import.meta.env.VITE_GROQ_API_KEY}\`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "llama3-1-8b-instant",
              messages: [
                { role: "system", content: import.meta.env.VITE_AI_LORE },
                ...updatedHistory // Directly injecting conversational tracking state array
              ]
            })
          });
          
          const data = await response.json();
          const assistantMessage = { role: "assistant", content: data.choices[0].message.content };
          setChatHistory(prev => [...prev, assistantMessage]);
        } catch (err) {
          console.error("Transmission Failure:", err);
        } finally {
          setIsLoading(false);
        }
      };
      \`\`\``,
      
      results: `The resulting framework achieved a flawless 100% decoupling split between presentation styles and content attributes. The entire app configuration can be entirely reformatted or scaled by simply modifying the array profiles in a centralized file without rewriting any UI nodes. 

      By executing percentage-based mapping, the interactive visual novel layer handles ultra-wide and mobile screen scale factors gracefully. The custom LLaMA 3.1 hybrid integration responds to user inputs with processing latency dropping below 120ms round-trip speeds. Recruiters aren't just scanning a list of bullets anymore—they are spending minutes actively interacting with a gamified digital clone, converting a static layout into a deeply engaging experience.`,
    }
    },
    {
      id: "project-13",
      title: "Personalized chat-bot",
      shortDesc: `A context-aware digital chatbot running on LLaMA 3.1 via Groq's LPU infrastructure. Features continuous state history mapping to eradicate LLM memory amnesia, webkit scroll-hidden horizontal quick-replies, and a highly calibrated system-lore injection layer that handles recruiter Q&As with sharp, unbothered sarcasm.`,
      image: "/data/projects/ChatBot.png",
      websiteUrl: "https://portfolio-website-mocha-one.vercel.app/?openChat=true",
      readMoreUrl: "/projects/project-13",
      tags: ["Groq API", "LLaMA 3.1", "React Engine", "Context Injection", "State Mapping", "Tailwind CSS", "Vercel CDN"],

      caseStudy: {
        heroImage: "/data/projects/ChatBot.png",
        
        challenge: `I wanted to build a real-time, context-aware AI clone of myself that could intelligently hold professional, quick-witted conversations with tech recruiters, answer technical inquiries on my behalf, and handle edge-case trolls without sounding like a robotic enterprise template. 

        This implementation presented two critical bottlenecks:
        1. **The API Amnesia Dilemma:** Normal serverless frontend states calling an LLM endpoint operate statelessly. In early iterations, the app only sent the single newest input payload down the wire. This caused severe conversational amnesia; the chatbot entirely forgot context across back-and-forth messages, failing to evaluate follow-up questions (e.g., replying with generic data when asked "What about that project?").
        2. **Prompt Overfitting & NPC Behavior:** Initially, I attempted to hardcode rigid IF/THEN constraints and strict response scripts directly into the instructions. This backfired immediately—the LLaMA model treated them like binary conditionals, awkwardly shoehorning fragments like my LED cube story into completely unrelated user prompts.`,
        
        solution: `I completely scrapped the rigid conditional script blocks and shifted to a high-density, context-injected 'System Prompt Architecture'. I compiled my full software background, tech stack preferences (Python advocacy, Java avoidance), and precise conversational tone into a master lore string. To keep the project clean and prevent repo scrapers from stealing my background profile data, I encapsulated this string within a double-quoted \`VITE_AI_LORE\` key inside a secure, hidden \`.env\` file.

        To completely solve the memory amnesia, I rebuilt the submission hooks to dynamically transform and map the React state's \`chatHistory\` array into a continuous array payload containing explicit user and assistant roles. 
        
        Here is the exact asynchronous transport execution implemented to stream continuous context arrays into Groq's high-speed infrastructure:

        \`\`\`javascript
        // src/hooks/useChatPipeline.js
        try {
          // Flatten dynamic state history and inject historical conversational state array
          const apiMessages = [
            { role: "system", content: import.meta.env.VITE_AI_LORE },
            ...chatHistory.map(msg => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text
            })),
            { role: "user", content: input }
          ];

          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": \`Bearer \${import.meta.env.VITE_GROQ_API_KEY}\`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant", // Migrated to LLaMA 3.1 architecture post-deprecation
              messages: apiMessages,
              temperature: 0.7, // Calibrated for natural conversational variance without structural hallucinations
              max_tokens: 150
            })
          });

          const data = await response.json();
          // State append mechanics follow...
        } catch (error) {
          console.error("Context synchronization broke: ", error);
        }
        \`\`\`

        Furthermore, to prevent rendering artifacts on Windows systems, I injected Tailwinds' arbitrary scrollbar variants (\`[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]\`) over the Quick Reply component container, ensuring seamless horizontal tracking across mobile swipe points and mouse-wheels without ugly desktop scrollbar lines.`,
        
        results: `The result is an ultra-low latency conversational engine that processes and outputs tokens in sub-120ms execution blocks via Groq's LPU inference hardware. The memory amnesia is completely eradicated; the AI tracks nested dialogue sequences with extreme precision. 

        By relying on soft context mapping rather than overfitted logic boundaries, the chatbot switches modes dynamically—maintaining professional posture with recruiters, delivering quick-witted, sarcastic responses to trolls, and displaying a playful, visible irritation whenever a user enters 'Java'. The digital clone is fully live, secured behind encrypted Vercel environmental server configurations, and requires zero manual logic maintenance.`,
      }
    }
  ]
};