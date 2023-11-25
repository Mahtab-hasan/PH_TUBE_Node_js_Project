document.addEventListener("DOMContentLoaded", function () {
  const btnSection = document.querySelector(".btnsection");
  const videoContainer = document.querySelector(".video-container");
  fetchCategories();

  function fetchCategories() {
    fetch("https://openapi.programming-hero.com/api/videos/categories")
      .then((response) => response.json())
      .then((categories) => {
        categories.data.forEach((category) => {
          addButton(category.category_id, category.category);
        });
        btnSection.addEventListener("click", handleButtonClick);

        document.querySelector(".btnsort").addEventListener("click", sortVideosByViews);
        fetchVideos("1000");
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }

  function addButton(categoryId, categoryText) {
    const button = document.createElement("button");
    button.classList.add("btnsort3");
    button.dataset.category = categoryId;
    button.textContent = categoryText;
    btnSection.appendChild(button);
  }
  function handleButtonClick(event) {
    if (event.target.classList.contains("btnsort3")) {
      const categoryId = event.target.dataset.category;
      fetchVideos(categoryId);
    }
  }
  function fetchVideos(categoryId) {
    videoContainer.innerHTML = "";
    if (categoryId === "1002") {
      displayNoContentMessage();
    } else {
      fetch(
        `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
      )
        .then((response) => response.json())
        .then((videos) => {
          if (videos.status === false && videos.data.length === 0) {
            displayNoContentMessage();
          } else {
            displayVideos(videos.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching Videos:", error);
          videoContainer.innerHTML = "An error occurred while fetching videos.";
        });
    }
  }

  function displayNoContentMessage() {
    const noDataContainer = document.createElement("div");
    noDataContainer.classList.add("no-data-container");

    const noDataImage = document.createElement("img");
    noDataImage.alt = "No Content"; 
    noDataImage.src = "./icon/Icon.png";

    const noDataMessage = document.createElement("p");
    noDataMessage.textContent = "Oops!! Sorry, There is no content here.";

    noDataContainer.appendChild(noDataImage);
    noDataContainer.appendChild(noDataMessage);

    videoContainer.appendChild(noDataContainer);
  }
  function displayVideos(videos) {
    videos.forEach((video) => {
      const postedDateInDays = parseInt(video?.others?.posted_date);

      if (!isNaN(postedDateInDays)) {
        const totalMinutes = postedDateInDays * 24 * 60;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);

        const formattedTime = `${String(hours).slice(0, 1)} ${
          hours === 1 ? "hour" : "hours"
        } ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;

        const videoElement = document.createElement("div");
        videoElement.classList.add("video");
        videoElement.innerHTML = `
            <div>

                <div class="imageParent">
                    <img class="thummailimg" src="${video.thumbnail}"alt = "${
          video.title
        }">
                    <p class="timeandmnt">Time: ${formattedTime}</p>
                </div>

                <div class="d-flex align-items-center">

                    <div class="authordivparent">

                        <div class="authorIMGparent">
                            <img class="authorIMG" src="${video?.authors?.map(
                              (authorImg) => authorImg.profile_picture
                            )}" alt="${video.title}">
                        </div>
                        <div>
                            <h3>${video.title}</h3>

                            <div class="verifiedname">
                                <p>${video?.authors?.map((authorImg) => authorImg.profile_name)}</p>
                                <p>${video?.authors?.map((authorImg) => authorImg.verified == true ? '<i class="fa-solid fa-certificate"></i>' : ''
                                )}</p>
                            </div>

                            <p class="video-views">Views: ${
                                video?.others?.views ? video?.others?.views : "no views"
                            }</p>

                        </div>

                    </div>
                </div>
            </div>
            `;
            videoContainer.appendChild(videoElement);
      }
      else 
      {
        console.error(
            "Invalid, 'posted_date', value:",
            video?.others?.posted_date
        );
      }
    });
  }
  function sortVideosByViews(){
    const videos = Array.from(videoContainer.querySelectorAll(".video"));
    videos.sort((a,b) => {
        const viewsA = extractViews(a);
        const viewsB = extractViews(b);
        return viewsB - viewsA;
    });
    videoContainer.innerHTML = "";
    videos.forEach((video) => {
        videoContainer.appendChild(video);
    });
  }

  function extractViews(videoElement){
    const viewsText = videoElement.querySelector(".video-views").textContent;
    const views = parseInt(viewsText.replace("Views: ", "").replace("K","000")) || 0;
    return views;
  }


});
