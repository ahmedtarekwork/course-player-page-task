// types
type OpenModalFn = (content: HTMLElement) => void;
type modalContentTypes =
  | "ask-question-open-model-btn"
  | "leader-boared-open-model-btn"
  | "lesson-item-detailed"
  | "exam";

document.addEventListener("fullscreenchange", () => {
  const fullscreenBtns = document.querySelectorAll(
    ".full-screen-btn"
  ) as NodeListOf<HTMLButtonElement>;

  fullscreenBtns.forEach((btn) => {
    btn.dataset.showIcon = `${
      document.fullscreenElement ? "exit-" : ""
    }fullscreen`;
  });
});

class Video {
  constructor() {
    this._putEventListenerOnTogglePlayPauseBtn();
    this._putEventListenerOnToggleWideScreenBtn();
    this._putEventListenerOnToggleFullScreenBtn();
    this._toggleShowVideoBtnOnMobile();
    this._activeReplayVideo();
  }

  private _toggleShowVideoBtnOnMobile() {
    const videoPlayers = document.querySelectorAll(
      ".video-player"
    ) as NodeListOf<HTMLDivElement>;

    videoPlayers.forEach((holder) => {
      const btnsHolder = holder.querySelector(
        ".video-player-btns-holder"
      ) as HTMLDivElement;

      holder.addEventListener("touchstart", (e) => {
        const touchedElement = e.target as HTMLElement;
        const videoEl = holder.querySelector("video");

        if (
          !(
            touchedElement.isEqualNode(videoEl) ||
            touchedElement.isEqualNode(holder) ||
            touchedElement.isEqualNode(btnsHolder)
          )
        )
          return;

        btnsHolder?.classList.toggle("active");

        setTimeout(() => btnsHolder?.classList.remove("active"), 3000);
      });
    });
  }

  private _putEventListenerOnToggleWideScreenBtn() {
    const btns = document.querySelectorAll(".wide-screen-btn");

    btns.forEach((btn) =>
      btn.addEventListener("click", this._toggleWideScreen)
    );
  }

  private _putEventListenerOnToggleFullScreenBtn() {
    const btns = document.querySelectorAll(".full-screen-btn");

    btns.forEach((btn) =>
      btn.addEventListener("click", this._toggleFullScreen)
    );
  }

  private _activeReplayVideo() {
    const btns = document.querySelectorAll(
      ".paly-pause-video-btn"
    ) as NodeListOf<HTMLButtonElement>;

    btns.forEach((btn) => {
      const videoPlayerHolder = btn.parentElement
        ?.parentElement as HTMLDivElement;
      const video = videoPlayerHolder.querySelector(
        "video"
      ) as HTMLVideoElement;

      video.addEventListener("timeupdate", () => {
        if (video.currentTime === video.duration) {
          btn.dataset.showIcon = "play";
        }
      });
    });
  }

  private _putEventListenerOnTogglePlayPauseBtn() {
    const btns = document.querySelectorAll(".paly-pause-video-btn");

    btns.forEach((btn) =>
      btn.addEventListener("click", this._togglePlayPauseBtn)
    );
  }

  private _toggleWideScreen() {
    document
      .querySelector(".video-player.wide-screen")
      ?.classList.toggle("active");
  }

  private _toggleFullScreen(e: Event) {
    const btn = e.currentTarget as HTMLButtonElement;
    const videoPlayerHolder = btn.parentElement?.parentElement
      ?.parentElement as HTMLDivElement;

    try {
      if (!document.fullscreenElement) {
        return videoPlayerHolder?.requestFullscreen();
      }

      document.exitFullscreen();
    } catch (_) {}
  }

  private _togglePlayPauseBtn(e: Event) {
    const btn = e.currentTarget as HTMLButtonElement;
    const videoPlayerHolder = btn.parentElement
      ?.parentElement as HTMLDivElement;
    const video = videoPlayerHolder.querySelector("video") as HTMLVideoElement;

    const currentIcon = btn.dataset.showIcon;

    switch (currentIcon) {
      case "play": {
        btn.dataset.showIcon = "pause";

        if (video.currentTime === video.duration) video.currentTime = 0;

        video?.play();
        break;
      }

      case "pause": {
        btn.dataset.showIcon = "play";
        video?.pause();

        break;
      }
    }

    console.log("hello world");
  }
}

class Modal {
  constructor() {
    this._handleCloseModal();
  }

  private _handleCloseModal() {
    const { closeBtn, modalHolder } = this._getModalElements();

    closeBtn?.addEventListener("click", () => {
      if (!modalHolder?.classList.contains("active")) return;

      modalHolder.classList.remove("active");
      document.body.style.removeProperty("overflow");
    });
  }

  public openModal(content: HTMLElement) {
    const { modalContentHolder, modalHolder } = this._getModalElements();

    if (modalHolder?.classList.contains("active")) return;

    modalContentHolder!.innerHTML = "";
    modalContentHolder!.append(content);

    modalHolder?.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  private _getModalElements() {
    const modalHolder = document.getElementById("modal");

    const closeBtn = modalHolder?.querySelector("#close-modal-btn");
    const modalContentHolder = modalHolder?.querySelector(
      "#modal-content-holder"
    );

    return {
      modalHolder,
      closeBtn,
      modalContentHolder,
    };
  }
}

class HandleOpenModalBtns {
  constructor(datasetVal: modalContentTypes, openModalFn: OpenModalFn) {
    this._putEventListenerOnBtn(datasetVal, openModalFn);
  }

  private _putEventListenerOnBtn(datasetVal: string, openModalFn: OpenModalFn) {
    const selector = `[data-open-modal="${datasetVal}"]`;

    document
      .querySelectorAll(selector)
      .forEach((btn) =>
        btn?.addEventListener("click", (e) =>
          this._handleClick(e, this, openModalFn)
        )
      );
  }

  private _handleClick(
    e: Event,
    parent: typeof this,
    openModelFn: OpenModalFn
  ) {
    const btn = e.currentTarget as HTMLButtonElement;

    const modalContent = parent._generateModalContent(
      btn.dataset.openModal as Parameters<
        typeof parent._generateModalContent
      >[0]
    );

    openModelFn(modalContent);
  }

  private _generateModalContent(datasetVal: modalContentTypes) {
    switch (datasetVal) {
      case "ask-question-open-model-btn": {
        const form = document.createElement("form");

        const title = document.createElement("h2");
        title.textContent = "Ask a question";
        title.style.marginBottom = "20px";

        const textarea = document.createElement("textarea");
        textarea.placeholder = "Ask a question";
        textarea.defaultValue =
          sessionStorage.getItem("ask-question-value") || "";

        textarea.oninput = (e) => {
          sessionStorage.setItem(
            "ask-question-value",
            (e.currentTarget as HTMLTextAreaElement).value
          );
        };

        const btn = document.createElement("button");
        btn.textContent = "Submit Question";
        btn.style.cssText = `display: flex; align-items: center; gap: 4px`;

        const arrowIcon = document.createElement("i");
        arrowIcon.className = "fa-solid fa-arrow-right";

        btn.append(arrowIcon);

        form.append(title, textarea, btn);

        return form;
      }

      case "leader-boared-open-model-btn": {
        const holder = document.createElement("div");
        holder.style.cssText = "color: #080264; text-align: center;";

        const courseName = document.createElement("p");
        courseName.textContent = "Course Name Shown Here";

        const title = document.createElement("h2");
        title.textContent = "Leaderboard";

        title.style.cssText = "font-weight: 600; font-size: 22px";

        const quote = document.createElement("div");
        quote.style.cssText = `padding: 20px; margin: 20px 0; border-radius: 5px; display: flex; align-items: center; gap: 10px; background-color: #F5F9FA;`;

        const emoji = document.createElement("p");
        emoji.textContent = "💪";
        emoji.style.cssText = `font-size: 50px; line-height: 87.5px; weight: 300`;

        const quoteText = document.createElement("p");
        quoteText.textContent =
          "عظيم يا صديقي.. أداءك في الكورس ده أفضل من 60% من باقي الطلبة.. كمّل عايز أشوف اسمك في الليدر بورد هنا";
        quoteText.style.cssText = `font-size: 15px; line-height: 26.25px; weight: 300`;

        quote.append(quoteText, emoji);

        const list = document.createElement("ul");
        list.style.cssText = `background-color: #F5F9FA; border-radius: 27px; padding: 59px 55px;`;

        for (let i = 0; i < 6; i++) {
          const item = document.createElement("li");
          item.style.cssText = `background-color: #fff; border: 1px solid #0000001A; border-radius: 5px; width: 100%; height: 67px;${
            i === 0 ? "" : " margin-top: 55px"
          }`;

          list.append(item);
        }

        holder.append(courseName, title, quote, list);

        return holder;
      }

      case "lesson-item-detailed": {
        const holder = document.createElement("div");

        const title = document.createElement("h2");
        title.textContent = "PDF Content";

        holder.append(title);

        return holder;
      }

      case "exam": {
        const holder = document.createElement("div");
        holder.style.cssText = `background-color: #445bc3; height: 100%; padding: 15px; overflow: hidden; max-width: 100%;`;

        const topSection = document.createElement("div");
        topSection.style.cssText = `display: flex; align-items: center;`;

        const backBtn = document.createElement("button");

        const backIcon = document.createElement("i");
        backIcon.className = "fa-solid fa-chevron-left";
        backIcon.style.cssText = "color: white; font-size: 20px";

        backBtn.append(backIcon);

        const timer = document.createElement("div");
        timer.style.cssText = `border-radius: 5px; color: white; display: flex; align-items-center; gap: 10px; background-color: #fbd500; padding: 7px 15px; margin-inline: auto; box-shadow: 0 0 50px -7px rgb(251, 213, 0.05);`;

        const alramIcon = document.createElement("img");
        alramIcon.src = "./icons/alarm-icon.png";
        alramIcon.alt = "alarm icon";
        alramIcon.width = 18;
        alramIcon.height = 18;
        alramIcon.style.cssText = "filter: invert(1);";

        timer.append(alramIcon);

        timer.append("09 :32");

        topSection.append(backBtn, timer);

        const paginationList = document.createElement("ul");
        paginationList.style.cssText = `display: flex; gap: 10px; margin-top: 45px; align-items: center; justify-content: center; font-weight: 500;`;

        for (let i = 0; i < 5; i++) {
          const item = document.createElement("li");
          item.style.cssText = `width: 50px; height: 50px; border-radius: 50%; border: 1px solid white; display: grid; place-content: center; ${
            i === 1 ? "color: #445bc3; background: white;" : "color: white;"
          }`;
          item.textContent = `${i + 1}`;

          paginationList.append(item);
        }

        const quizList = document.createElement("ul");
        quizList.style.cssText = `display: flex; gap: 10px; margin-top: 25px; position: relative; width: 100%;`;

        const generateAnswersList = () => {
          const answersList = document.createElement("ul");

          ["Asam", "Bahar", "Kamaltake", "Utter Pardesh"].forEach((ans, i) => {
            const answer = document.createElement("li");

            answer.style.cssText = `${
              i === 1
                ? "background-color: #445bc3; color: white;"
                : "background-color: white; color: #000;"
            }; width: 100%; border-radius: 10px; cursor: pointer; margin-top: 20px; box-shadow: 0 0 10px 4px rgba(0, 0, 0, 0.1); display: flex; align-items: center;`;

            const checkBox = document.createElement("div");
            checkBox.style.cssText = `width: 20px; height: 20px; ${
              i === 1
                ? "border: 1px solid white;"
                : "border: 1px solid #445bc3;"
            } display: grid; place-content: center; border-radius: 4px; margin: 10px;`;

            if (i === 1) {
              const circle = document.createElement("div");
              circle.style.cssText = `width: 7px; height: 7px; background: white; border-radius: 50%;`;

              checkBox.append(circle);
            }

            const content = document.createElement("p");
            content.textContent = ans;

            answer.append(checkBox, content);

            answersList.append(answer);
          });

          return answersList;
        };

        for (let i = 0; i < 5; i++) {
          const quiz = document.createElement("li");
          quiz.style.cssText = `background-color: white; border-radius: 15px; padding: 15px; width: 100%; position: absolute; width: 100% top: 0; left: calc(${i} * 10px + ${i} * 100%);`;

          const number = document.createElement("b");
          number.style.cssText = "display: block;";
          number.textContent = `${i + 1}.`;

          const question = document.createElement("b");
          question.style.cssText = "display: block; margin: 15px 0;";
          question.textContent =
            "Among the following status of India, which one has the oldest rock formations in the country?";

          quiz.append(number, question, generateAnswersList());

          quizList.append(quiz);
        }

        holder.append(topSection, paginationList, quizList);

        return holder;
      }
    }
  }
}

class Accordion {
  constructor() {
    this._putEventListenerOnAccordionBtn();
  }

  private _getAccordions() {
    return [...document.querySelectorAll(".weeks-section.accordion")];
  }

  private _toggleOpenAccordion = (e: Event, parent: typeof this) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const itemsList = btn.nextElementSibling as HTMLUListElement;

    const totalAccordionItemsHeight = (
      [...itemsList.children] as HTMLLIElement[]
    )
      .map((child) => child.offsetHeight)
      .reduce((acc, curr) => acc + curr, 0);

    if (itemsList.classList.contains("active")) {
      itemsList.style.removeProperty("height");
      itemsList.style.removeProperty("border-color");
    } else {
      parent._closeOtherAccordions();

      itemsList.style.cssText = `
      height: ${totalAccordionItemsHeight}px;
      border-color: #eeeeee;
    `;
    }

    itemsList.classList.toggle("active");
  };

  private _putEventListenerOnAccordionBtn() {
    this._getAccordions().forEach((acc) =>
      acc
        .querySelector("button:has(h3)")!
        .addEventListener("click", (e) => this._toggleOpenAccordion(e, this))
    );
  }

  private _closeOtherAccordions() {
    this._getAccordions().forEach((acc) => {
      const itemsList = acc.querySelector(
        ".week-lessons-list"
      ) as HTMLUListElement;

      if (itemsList) {
        itemsList.classList.remove("active");
        itemsList.style.removeProperty("height");
        itemsList.style.removeProperty("border-color");
      }
    });
  }
}

class ProgressPercent {
  constructor() {
    this._doAnimation();
  }

  private _doAnimation() {
    (
      document.querySelectorAll(".finish-percent") as NodeListOf<HTMLDivElement>
    ).forEach((holder) => {
      const { fillPercentElements, numberPercents } =
        this._getMainElements(holder);

      this._startAnimate(holder, () => {
        this._animateFillElement(fillPercentElements!);
        this._animatePercentNumber(numberPercents);
      });
    });
  }

  private _animatePercentNumber(PercentNumberElement: HTMLSpanElement) {
    let interval: ReturnType<typeof setInterval>;

    let percent = 0;

    interval = setInterval(() => {
      percent = percent + 5 >= 63 ? 63 : percent + 5;
      PercentNumberElement.textContent = `${percent}%`;

      if (percent >= 63) clearInterval(interval);
    }, 0);
  }

  private _animateFillElement(fillPercentElement: HTMLDivElement) {
    fillPercentElement!.style.width = `63%`;
  }

  private _startAnimate(mainHolder: HTMLDivElement, callback: () => void) {
    let done = false;

    if (scrollY + window.screen.height >= mainHolder.offsetTop + 50) {
      if (!done) {
        callback();
        done = true;
      }
    }

    window.addEventListener("scroll", () => {
      if (scrollY + window.screen.height >= mainHolder.offsetTop + 50) {
        if (!done) {
          callback();
          done = true;
        }
      }
    });
  }

  private _getMainElements(holder: HTMLDivElement) {
    const fillPercentElements = holder.querySelector("div");
    const numberPercents = holder.querySelector("#percent") as HTMLSpanElement;

    return { fillPercentElements, numberPercents };
  }
}

new ProgressPercent();
new Accordion();
new Video();

const modal = new Modal();

new HandleOpenModalBtns(
  "ask-question-open-model-btn",
  modal.openModal.bind(modal)
);
new HandleOpenModalBtns(
  "leader-boared-open-model-btn",
  modal.openModal.bind(modal)
);
new HandleOpenModalBtns("lesson-item-detailed", modal.openModal.bind(modal));
new HandleOpenModalBtns("exam", modal.openModal.bind(modal));
