document.addEventListener("DOMContentLoaded", function() {

	// page loader
	const wrap = document.querySelector('.wrap');
	const infoValue = document.querySelector('.info-value');
	const loaderImages = document.querySelectorAll('.elm-photo img');

	if (wrap && loaderImages.length && !wrap.classList.contains('wrap-noload')) {
		const MIN_DURATION = 2000;
		const imgCount = loaderImages.length;
		wrap.classList.add('wrap-load');
		const resources = performance.getEntriesByType('resource');
		const totalResources = resources.length || 1;
		let loadedResources = 0;
		let realProgress = 0;
		const observer = new PerformanceObserver((list) => {
			loadedResources += list.getEntries().length;
			realProgress = Math.min(loadedResources / Math.max(totalResources, loadedResources), 1);
		});
		observer.observe({ type: 'resource', buffered: true });
		let currentImg = 0;
		let lastImgSwitch = 0;
		const startTime = performance.now();
		function finish() {
			observer.disconnect();
			if (infoValue) infoValue.textContent = '100%';
			wrap.classList.remove('wrap-load');
		}
		function animatePercent(ts) {
			const elapsed = Math.max(ts - startTime, 0);
			const timeProgress = Math.min(elapsed / MIN_DURATION, 1);

			const displayProgress = Math.min(realProgress, timeProgress);

			if (infoValue) infoValue.textContent = Math.floor(displayProgress * 100) + '%';
			const imgIndex = Math.min(Math.floor(displayProgress * imgCount), imgCount - 1);
			if (imgIndex !== currentImg) {
				loaderImages[currentImg].style.opacity = '0';
				currentImg = imgIndex;
				loaderImages[currentImg].style.opacity = '1';
			}

			const done = elapsed >= MIN_DURATION && realProgress >= 1;
			if (!done) {
				requestAnimationFrame(animatePercent);
			} else {
				finish();
			}
		}
		if (document.readyState === 'complete') {
			realProgress = 1;
		} else {
			window.addEventListener('load', () => { realProgress = 1; }, { once: true });
		}

		requestAnimationFrame(animatePercent);
	}
	// end page loader



	
	
	//fancybox
	Fancybox.bind("[data-fancybox]", {
		//settings
	});



	//copy button
	document.querySelectorAll('.js-btn-copy').forEach(function(btn) {
		btn.addEventListener('click', function(e) {
			e.preventDefault();
			const content = btn.getAttribute('data-content');
			if (content) {
				navigator.clipboard.writeText(content)
					.then(() => {
						// alert('Скопировано!');
					})
					.catch(err => {
						// Обработка ошибок, если не удалось скопировать
						alert('Ошибка копирования');
					});
			}
		});
	});

	//side menu toggle
	document.querySelectorAll('.js-menu-toggle').forEach(toggle => {
		toggle.addEventListener('click', function(e) {
			e.preventDefault();
			if (window.innerWidth >= 1024) {
				document.body.classList.toggle('menu-active');
				document.body.classList.remove('menu-small-active');
				document.body.classList.remove('menu-active-mobile');
			} else {
				document.body.classList.toggle('menu-active-mobile');
				//document.body.classList.remove('menu-active');
				//document.body.classList.remove('menu-small-active');
			}
		});
	});
	document.querySelectorAll('.js-menu-width-toggle').forEach(toggle => {
		toggle.addEventListener('click', function(e) {
			e.preventDefault();
			if (document.body.classList.contains('menu-active')) {
				document.body.classList.toggle('menu-small-active');
			} else {
				document.body.classList.add('menu-active');
			}
		});
	});


	//btn tgl and add
	let tglButtons = document.querySelectorAll('.js-btn-tgl')
	let addButtons = document.querySelectorAll('.js-btn-add')
	let buttonsTglOne = document.querySelectorAll('.js-btn-tgl-one');
	for (i = 0;i < tglButtons.length;i++) {
		tglButtons[i].addEventListener('click', function(e) {
			this.classList.contains('active') ? this.classList.remove('active') : this.classList.add('active')
			e.preventDefault()
			return false
		})
	}
	for (i = 0;i < addButtons.length;i++) {
		addButtons[i].addEventListener('click', function(e) {
			if (!this.classList.contains('active')) {
				this.classList.add('active');
				e.preventDefault()
				return false
			}
		})
	}
	buttonsTglOne.forEach(function(button) {
		button.addEventListener('click', function(e) {
			e.preventDefault();
			let toggleButtonsWrap = this.closest('.js-toggle-buttons');
	
			if (this.classList.contains('active')) {
				this.classList.remove('active');
			} else {
				toggleButtonsWrap.querySelectorAll('.js-btn-tgl-one').forEach(function(btn) {
					btn.classList.remove('active');
				});
				this.classList.add('active');
			}
			return false;
		});
	});

	

	//js popup wrap
	const togglePopupButtons = document.querySelectorAll('.js-btn-popup-toggle')
	const closePopupButtons = document.querySelectorAll('.js-btn-popup-close')
	const popupElements = document.querySelectorAll('.js-popup-wrap')
	const wrapWidth = document.querySelector('.wrap').offsetWidth
	const bodyElem = document.querySelector('body')
	function popupElementsClear() {
		document.body.classList.remove('menu-show')
		document.body.classList.remove('filter-show')
		document.body.classList.remove('search-show')
		popupElements.forEach(element => element.classList.remove('popup-right'))
	}
	function popupElementsClose() {
		togglePopupButtons.forEach(element => {
			if (window.innerWidth < 1024) {
				if (!element.closest('.no-close-mobile') && !element.closest('.no-close')) {
					element.classList.remove('active')
				}

			} else if  (window.innerWidth > 1023) {
				if (!element.closest('.no-close-desktop') && !element.closest('.no-close')) {
					element.classList.remove('active')
				}
			} else {
				if (!element.closest('.no-close')) {
					element.classList.remove('active')
				}
			}
			
		})
	}
	function popupElementsContentPositionClass() {
		popupElements.forEach(element => {
			let pLeft = element.offsetLeft
			let pWidth = element.querySelector('.js-popup-block').offsetWidth
			let pMax = pLeft + pWidth;
			if (pMax > wrapWidth) {
				element.classList.add('popup-right')
			} else {
				element.classList.remove('popup-right')
			}
		})
	}
	for (i = 0; i < togglePopupButtons.length; i++) {
		togglePopupButtons[i].addEventListener('click', function (e) {
			popupElementsClear()
			if (this.classList.contains('active')) {
				this.classList.remove('active')
			} else {
				popupElementsClose()
				this.classList.add('active')
				if (this.closest('.popup-menu-wrap')) {
					document.body.classList.add('menu-show')
				}
				if (this.closest('.popup-search-wrap')) {
					document.body.classList.add('search-show')
				}
				if (this.closest('.popup-filter-wrap')) {
					document.body.classList.add('filter-show')
				}
				popupElementsContentPositionClass()
			}
			e.preventDefault()
			e.stopPropagation()
			return false
		})
	}
	for (i = 0; i < closePopupButtons.length; i++) {
		closePopupButtons[i].addEventListener('click', function (e) {
			popupElementsClear()
			popupElementsClose()
			e.preventDefault()
			e.stopPropagation()
			return false;
		})
	}
	document.onclick = function (event) {
		if (!event.target.closest('.js-popup-block')) {
			popupElementsClear()
			popupElementsClose()
		}
	}
	popupElements.forEach(element => {
		if (element.classList.contains('js-popup-select')) {
			let popupElementSelectItem = element.querySelectorAll('.js-popup-block li a')
			if (element.querySelector('.js-popup-block .active')) {
				element.classList.add('select-active')
				let popupElementActive = element.querySelector('.js-popup-block .active').innerHTML
				let popupElementButton = element.querySelector('.js-btn-popup-toggle')
				popupElementButton.innerHTML = ''
				popupElementButton.insertAdjacentHTML('beforeend', popupElementActive)
			} else {
				element.classList.remove('select-active')
			}
			for (i = 0; i < popupElementSelectItem.length; i++) {
				popupElementSelectItem[i].addEventListener('click', function (e) {
					this.closest('.js-popup-wrap').classList.add('select-active')
					if (this.closest('.js-popup-wrap').querySelector('.js-popup-block .active')) {
						this.closest('.js-popup-wrap').querySelector('.js-popup-block .active').classList.remove('active')
					}
					this.classList.add('active')
					let popupElementActive = element.querySelector('.js-popup-block .active').innerHTML
					let popupElementButton = element.querySelector('.js-btn-popup-toggle')
					popupElementButton.innerHTML = ''
					popupElementButton.insertAdjacentHTML('beforeend', popupElementActive)
					popupElementsClear()
					popupElementsClose()
					if (!this.closest('.js-tabs-nav')) {
						e.preventDefault()
						e.stopPropagation()
						return false
					}
				})
			}
		}
	})


	//js tabs
	const tabsNav = document.querySelectorAll('.js-tabs-nav')
	const tabsBlocks = document.querySelectorAll('.js-tab-block')
	const tabsButtonTitle = document.querySelectorAll('.js-tab-title')
	const tabsButtonContent = document.querySelectorAll('.js-tab-content')
	function tabsActiveStart() {
		for (iTab = 0; iTab < tabsBlocks.length; iTab++) {
			if (tabsBlocks[iTab].classList.contains('active')) {
				tabsBlocks[iTab].classList.remove('active')
			}
		}
		for (i = 0; i < tabsNav.length; i++) {
			let tabsNavElements = tabsNav[i].querySelectorAll('[data-tab]')
			for (iElements = 0; iElements < tabsNavElements.length; iElements++) {
				if (tabsNavElements[iElements].classList.contains('active')) {
					let tabsNavElementActive = tabsNavElements[iElements].dataset.tab
					for (j = 0; j < tabsBlocks.length; j++) {
						if (tabsBlocks[j].dataset.tab.toString().indexOf(tabsNavElementActive) > -1) {
							console.log(tabsBlocks[j].dataset.tab.toString().indexOf(tabsNavElementActive))
							tabsBlocks[j].classList.add('active')
						}
					}
				}
			}
		}
		
	}
	for (i = 0; i < tabsButtonTitle.length; i++) {
		tabsButtonTitle[i].addEventListener('click', function (e) {
			this.classList.toggle('active')
			e.preventDefault()
			e.stopPropagation()
			return false
		})
	}
	for (i = 0; i < tabsNav.length; i++) {
		tabsNav[i].addEventListener('click', function (e) {
			if (e.target.closest('[data-tab]')) {
				let tabsNavElements = this.querySelector('[data-tab].active')
				tabsNavElements ? tabsNavElements.classList.remove('active') : false
				e.target.closest('[data-tab]').classList.add('active')
				tabsActiveStart()
				e.preventDefault()
				e.stopPropagation()
				return false
			}
		})
	}
	tabsActiveStart()



	// Popups
	let popupCurrent;
	let popupsList = document.querySelectorAll('.popup-outer-box');
	let popupTimer = null;
	
	document.addEventListener("click", function(e) {
		const openButton = e.target.closest(".js-popup-open");
		if (openButton) {
			document.querySelector(".popup-outer-box")?.classList.remove("active");
			document.body.classList.add("popup-open");
			if (popupTimer) {
				clearTimeout(popupTimer);
				popupTimer = null;
			}
			for (let i = 0; i < popupsList.length; i++) {
				popupsList[i].classList.remove("active");
			}
			popupCurrent = openButton.getAttribute("data-popup");
			const popupElement = document.querySelector(`.popup-outer-box[id="${popupCurrent}"]`);
			popupElement.classList.add("active");
			const timerValue = openButton.getAttribute("data-popup-timer");
			if (timerValue) {
				const timerMs = parseInt(timerValue);
				if (!isNaN(timerMs) && timerMs > 0) {
					popupTimer = setTimeout(function() {
						document.body.classList.remove("popup-open");
						document.body.classList.remove("popup-open-scroll");
						popupElement.classList.remove("active");
						popupTimer = null;
					}, timerMs);
				}
			}
			e.preventDefault();
			e.stopPropagation();
			return;
		}
		const closeButton = e.target.closest(".js-popup-close");
		if (closeButton) {
			if (popupTimer) {
				clearTimeout(popupTimer);
				popupTimer = null;
			}
			document.body.classList.remove("popup-open");
			for (let i = 0; i < popupsList.length; i++) {
				popupsList[i].classList.remove("active");
			}
			e.preventDefault();
			e.stopPropagation();
		}
	});
	window.openPopupMessage = function(selector) {
		const popupElement = document.querySelector(selector);
		if (!popupElement) return;
		document.body.classList.add('popup-open');
		popupElement.classList.add('active');
	};
	window.closePopup = function(popupId) {
		if (popupTimer) {
			clearTimeout(popupTimer);
			popupTimer = null;
		}
		const popupElement = document.querySelector(`.popup-outer-box[id="${popupId}"]`);
		if (popupElement) {
			popupElement.classList.remove("active");
		}
		const activePopups = document.querySelectorAll('.popup-outer-box.active');
		if (activePopups.length === 0) {
			document.body.classList.remove("popup-open");
			document.body.classList.remove("popup-open-scroll");
		}
	};

	// open popup 
	//openPopupMessage('#popup-order');

	// close popup
	//closePopup('popup-order');


})
