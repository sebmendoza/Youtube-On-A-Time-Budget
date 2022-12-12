// This script injects an element at the top of the page.
// It doesn't work yet. To make it work, handle the TODO.

// TODO: rework code to account for videos loaded as you scroll

/* This runs after a web page loads */

TEN_MIN_SECONDS = 600;

// COMPUTATION FUNCTIONS
const convertMinutesToSeconds = (num) => {
  let seconds = parseInt(num) * 60;
  return seconds;
};

const convertHoursToSeconds = (num) => {
  let seconds = parseInt(num) * 60 * 60;
  return seconds;
};

const timeStringtoInt = (ytTime) => {
  const ytTimeArray = ytTime.split(":");
  const length = ytTimeArray.length;
  let videoLength = 0; // seconds
  switch (length) {
    case 1:
      return parseInt(ytTimeArray[0]);
    case 2:
      videoLength =
        convertMinutesToSeconds(ytTimeArray[0]) + parseInt(ytTimeArray[1]);
      return videoLength;
    case 3:
      videoLength =
        convertHoursToSeconds(ytTimeArray[0]) +
        convertMinutesToSeconds(ytTimeArray[1]) +
        parseInt(ytTimeArray[2]);
      return videoLength;
    default:
      return 0;
  }
};

// main function
window.onload = function main() {
  let contentFeed = document.querySelector("#contents > ytd-rich-grid-row");
  let timestamps = document.querySelectorAll(
    "#overlays.style-scope.ytd-thumbnail"
  );

  // insert warning element
  const warning = document.createElement("div");
  warning.innerHTML = "Over 10 min! \n\n Careful With Your Time 🙂";
  warning.classList.add("cautionSign");
  document.body.appendChild(warning);

  // get rid of some shorts sections
  let shortsSection = document.querySelector(
    "#content > ytd-rich-shelf-renderer"
  );
  let shortsNavBar = document.querySelector('[aria-label="Shorts"]');

  if (shortsSection) {
    shortsSection.classList.add("hide");
  }
  if (shortsNavBar) {
    shortsNavBar.classList.add("hide");
  }

  if (!contentFeed || !shortsNavBar) {
    //The node we need does not exist yet. So let's wait and try again.
    window.setTimeout(main, 500);
    return;
  }

  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      timestamps.forEach((timestamp) => {
        if (timestamp.childNodes[0]) {
          let timeStampInnerText =
            timestamp.childNodes[0].childNodes[2].innerText;

          if (timeStampInnerText) {
            let timeString = timeStampInnerText.trim();
            let seconds = timeStringtoInt(timeString);
            const imageThumbnail = timestamp.parentElement;
            const videoDetails =
              imageThumbnail.parentElement.parentElement.querySelector(
                "#details"
              );

            if (seconds > TEN_MIN_SECONDS) {
              imageThumbnail.onmouseenter = () => {
                warning.classList.add("cautionSignShow");
              };
              imageThumbnail.onmouseleave = () => {
                warning.classList.remove("cautionSignShow");
              };
              videoDetails.onmouseenter = () => {
                warning.classList.add("cautionSignShow");
              };
              videoDetails.onmouseleave = () => {
                warning.classList.remove("cautionSignShow");
              };
            }
          }
        }
      });
    });
  });

  let config = {
    childList: true,
    subtree: true,
  };

  observer.observe(contentFeed, config);
};
