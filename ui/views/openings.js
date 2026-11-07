(function (global) {
	function create(options) {
		let lastSnapshot = null;
		let ecoSearch = '';
		let ecoLetter = 'all';
		let selectedEco = null;
		let pendingFocusSearch = false;
		let pendingScrollSelection = false;
		let bookSearch = '';
		let bookLetter = 'all';
		let selectedBookKey = null;
		let pendingScrollBookSelection = false;

		function getRootElement() {
			return document.getElementById('view-openings');
		}

		function init() {
			const root = getRootElement();
			if (!root || root.dataset.bound) return;
			root.dataset.bound = 'true';

			root.addEventListener('click', event => {
				const sectionButton = event.target.closest('[data-openings-section]');
				if (sectionButton && typeof options.onChangeSection === 'function') {
					options.onChangeSection(sectionButton.getAttribute('data-openings-section'));
					return;
				}

				const ecoLoadButton = event.target.closest('[data-eco-load-line]');
				if (ecoLoadButton && typeof options.onLoadEcoLine === 'function') {
					options.onLoadEcoLine(ecoLoadButton.getAttribute('data-eco-load-line'));
					return;
				}

				const ecoFilterButton = event.target.closest('[data-eco-letter]');
				if (ecoFilterButton) {
					ecoLetter = ecoFilterButton.getAttribute('data-eco-letter') || 'all';
					pendingScrollSelection = true;
					render(lastSnapshot);
					return;
				}

				const ecoClearButton = event.target.closest('[data-eco-clear-search]');
				if (ecoClearButton) {
					ecoSearch = '';
					pendingFocusSearch = true;
					render(lastSnapshot);
					return;
				}

				const ecoCurrentButton = event.target.closest('[data-eco-jump-current]');
				if (ecoCurrentButton) {
					const recognized = getRecognizedFromSnapshot(lastSnapshot);
					if (recognized && recognized.eco) {
						selectedEco = recognized.eco;
						ecoLetter = String(recognized.eco).charAt(0) || 'all';
						pendingScrollSelection = true;
						render(lastSnapshot);
					}
					return;
				}

				const ecoCodeButton = event.target.closest('[data-eco-code]');
				if (ecoCodeButton) {
					selectedEco = ecoCodeButton.getAttribute('data-eco-code') || null;
					pendingScrollSelection = true;
					render(lastSnapshot);
					return;
				}

				const bookFilterButton = event.target.closest('[data-book-letter]');
				if (bookFilterButton) {
					bookLetter = bookFilterButton.getAttribute('data-book-letter') || 'all';
					pendingScrollBookSelection = true;
					render(lastSnapshot);
					return;
				}

				const bookClearButton = event.target.closest('[data-book-clear-search]');
				if (bookClearButton) {
					bookSearch = '';
					render(lastSnapshot);
					return;
				}

				const bookCurrentButton = event.target.closest('[data-book-jump-current]');
				if (bookCurrentButton) {
					const recognized = getRecognizedFromSnapshot(lastSnapshot);
					if (recognized && recognized.key) {
						selectedBookKey = recognized.key;
						bookLetter = String(recognized.eco || '').charAt(0) || 'all';
						pendingScrollBookSelection = true;
						render(lastSnapshot);
					}
					return;
				}

				const bookLoadButton = event.target.closest('[data-book-load-line]');
				if (bookLoadButton && typeof options.onLoadEcoLine === 'function') {
					options.onLoadEcoLine(bookLoadButton.getAttribute('data-book-load-line'));
					return;
				}

				const bookKeyButton = event.target.closest('[data-book-key]');
				if (bookKeyButton) {
					selectedBookKey = bookKeyButton.getAttribute('data-book-key') || null;
					pendingScrollBookSelection = true;
					render(lastSnapshot);
					return;
				}

				const moveButton = event.target.closest('[data-opening-move]');
				if (moveButton && typeof options.onPlayMove === 'function') {
					options.onPlayMove(moveButton.getAttribute('data-opening-move'));
					return;
				}

				const moveIndexButton = event.target.closest('[data-opening-index]');
				if (moveIndexButton && typeof options.onSelectMove === 'function') {
					options.onSelectMove(parseInt(moveIndexButton.getAttribute('data-opening-index'), 10));
					return;
				}

				const playButton = event.target.closest('[data-openings-play]');
				if (playButton && typeof options.onShowPlay === 'function') {
					options.onShowPlay();
				}
			});

			root.addEventListener('input', event => {
				const searchInput = event.target.closest('[data-eco-search]');
				if (searchInput) {
					ecoSearch = String(searchInput.value || '');
					render(lastSnapshot);
					return;
				}
				const bookSearchInput = event.target.closest('[data-book-search]');
				if (!bookSearchInput) return;
				bookSearch = String(bookSearchInput.value || '');
				render(lastSnapshot);
			});

			root.addEventListener('keydown', event => {
				const searchInput = event.target.closest('[data-eco-search]');
				if (!searchInput) return;

				if (event.key === 'Escape') {
					if (!ecoSearch) return;
					event.preventDefault();
					ecoSearch = '';
					pendingFocusSearch = true;
					render(lastSnapshot);
					return;
				}

				if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
					event.preventDefault();
					moveEcoSelection(event.key === 'ArrowDown' ? 1 : -1);
					return;
				}

				if (event.key === 'Enter') {
					const filteredCatalog = getFilteredCatalog();
					if (!filteredCatalog.length) return;
					event.preventDefault();
					if (!selectedEco || !filteredCatalog.some(entry => entry.eco === selectedEco)) {
						selectedEco = filteredCatalog[0].eco;
					}
					pendingScrollSelection = true;
					render(lastSnapshot);
				}
			});
		}

		function render(snapshot) {
			const root = getRootElement();
			if (!root) return;
			const searchState = captureEcoSearchState(root);
			lastSnapshot = snapshot || {};

			const opening = snapshot && snapshot.opening ? snapshot.opening : { recognized: null, sanLine: [], nextMoves: [] };
			const recognized = opening.recognized || null;
			const history = copyArraySafe(snapshot && snapshot.moveHistory, snapshot && typeof snapshot.currentMoveIndex === 'number' ? snapshot.currentMoveIndex + 1 : 0);
			const ecoCatalog = Array.isArray(snapshot && snapshot.ecoCatalog) ? snapshot.ecoCatalog : [];
			const explorerBookCatalog = Array.isArray(snapshot && snapshot.explorerBookCatalog) ? snapshot.explorerBookCatalog : [];
			const openingsSection = snapshot && snapshot.openingsSection ? snapshot.openingsSection : 'explorer';
			const filteredCatalog = getFilteredCatalog(ecoCatalog);
			const activeEco = resolveSelectedEco(filteredCatalog, recognized);
			const activeEntry = filteredCatalog.find(entry => entry.eco === activeEco) || null;

			root.innerHTML = [
				'<div class="openings-layout">',
				'<section class="openings-panel">',
				'<div class="openings-header">',
				'<div>',
				'<h2>' + escapeHtml(snapshot && snapshot.openingsSectionLabel ? snapshot.openingsSectionLabel : 'Opening Explorer') + '</h2>',
				'<p>' + escapeHtml(getSectionDescription(openingsSection)) + '</p>',
				'</div>',
				'<button type="button" class="play-action-btn" data-openings-play="true">Back To Play</button>',
				'</div>',
				renderSectionTabs(openingsSection),
				renderSectionContent({
					section: openingsSection,
					opening: opening,
					recognized: recognized,
					history: history,
					ecoCatalog: ecoCatalog,
					filteredCatalog: filteredCatalog,
					activeEntry: activeEntry,
					explorerBookCatalog: explorerBookCatalog,
				}),
				'</section>',
				'</div>'
			].join('');

			restoreEcoSearchState(root, searchState);
			restoreEcoSelectionScroll(root);
			restoreBookSelectionScroll(root);
		}

		function getSectionDescription(section) {
			switch (section) {
				case 'eco':
					return 'Browse the full ECO index and inspect recorded encyclopedia lines for each code.';
				case 'book':
					return 'Inspect the bundled opening book, current continuations, and load stored lines into the live board.';
				case 'stats':
					return 'See true win/draw/loss percentages for the active line, its continuations, and the stored explorer catalog.';
				case 'explorer':
				default:
					return 'Recognize the current ECO line and continue from the browser window.';
			}
		}

		function renderSectionTabs(activeSection) {
			const sections = [
				{ id: 'explorer', label: 'Explorer' },
				{ id: 'eco', label: 'ECO' },
				{ id: 'book', label: 'Book' },
				{ id: 'stats', label: 'Stats' },
			];
			return '<div class="openings-section-tabs">' + sections.map(function (section) {
				return '<button type="button" class="analysis-section-tab' + (section.id === activeSection ? ' active' : '') + '" data-openings-section="' + escapeHtml(section.id) + '">' + escapeHtml(section.label) + '</button>';
			}).join('') + '</div>';
		}

		function renderSectionContent(payload) {
			switch (payload.section) {
				case 'eco':
					return renderEcoBrowser(payload.filteredCatalog, payload.ecoCatalog, payload.activeEntry, payload.recognized);
				case 'book':
					return renderBookSection(payload.opening, payload.recognized, payload.explorerBookCatalog);
				case 'stats':
					return renderStatsSection(payload.opening, payload.recognized, payload.explorerBookCatalog, payload.history);
				case 'explorer':
				default:
					return renderExplorerSection(payload.opening, payload.recognized, payload.history, payload.filteredCatalog, payload.ecoCatalog, payload.activeEntry);
			}
		}

		function renderExplorerSection(opening, recognized, history, filteredCatalog, ecoCatalog, activeEntry) {
			return [
				recognized
					? '<div class="opening-badge large"><span class="opening-eco">' + escapeHtml(recognized.eco || '-') + '</span><span class="opening-name">' + escapeHtml(recognized.label || recognized.name || 'Recognized line') + '</span><span class="opening-weight">' + escapeHtml(recognized.popularity || '') + '</span></div>'
					: '<div class="engine-summary-empty">No ECO line recognized for the current move order.</div>',
				recognized
					? '<div class="opening-subtitle"><strong>Family:</strong> ' + escapeHtml(recognized.familyLabel || recognized.family || '-') + ' • <strong>Book lines:</strong> ' + escapeHtml(String(recognized.familySize || 1)) + '</div>'
					: '',
				renderAliasMeta(recognized && recognized.aliases),
				'<div class="engine-pv"><strong>Current line:</strong> ' + escapeHtml(opening.sanLine && opening.sanLine.length ? opening.sanLine.join(' ') : 'No moves played yet.') + '</div>',
				'<div class="opening-explorer-grid">',
				'<section class="play-panel">',
				'<h3 class="play-panel-title">Explorer Moves</h3>',
				(opening.nextMoves && opening.nextMoves.length
					? '<div class="opening-next-list vertical">' + opening.nextMoves.map(renderExplorerMove).join('') + '</div>'
					: '<div class="engine-summary-empty">No catalog continuations are stored for this position.</div>'),
				'</section>',
				'<section class="play-panel">',
				'<h3 class="play-panel-title">Transpositions</h3>',
				(recognized && Array.isArray(recognized.transpositions) && recognized.transpositions.length
					? '<div class="opening-transposition-list">' + recognized.transpositions.map(renderTransposition).join('') + '</div>'
					: '<div class="engine-summary-empty">No alternative move-order transpositions recorded for this family.</div>'),
				'</section>',
				'<section class="play-panel">',
				'<h3 class="play-panel-title">Played Sequence</h3>',
				(history.length
					? '<div class="opening-history-list">' + history.map(renderHistoryMove).join('') + '</div>'
					: '<div class="engine-summary-empty">The explorer follows the game as soon as moves are played.</div>'),
				'</section>',
				'</div>',
				renderEcoBrowser(filteredCatalog, ecoCatalog, activeEntry, recognized),
			].join('');
		}

		function renderBookSection(opening, recognized, explorerBookCatalog) {
			const filteredBook = getFilteredBookCatalog(explorerBookCatalog);
			const activeBookKey = resolveSelectedBook(filteredBook, recognized);
			const activeEntry = filteredBook.find(function (entry) { return entry.key === activeBookKey; }) || null;
			return [
				'<div class="opening-stat-chips">',
				renderStatChip('Book entries', String(copyArraySafe(explorerBookCatalog).length)),
				renderStatChip('Visible lines', String(filteredBook.length)),
				renderStatChip('Current continuations', String(copyArraySafe(opening.nextMoves).length)),
				recognized ? renderStatChip('Matched line', recognized.eco || '-') : '',
				'</div>',
				renderBookBrowser(filteredBook, explorerBookCatalog, activeEntry, recognized),
			].join('');
		}

		function renderStatsSection(opening, recognized, explorerBookCatalog, history) {
			const nextMoves = copyArraySafe(opening && opening.nextMoves);
			const currentWdl = opening && opening.currentWdl ? opening.currentWdl : sumWdlFromEntries(nextMoves);
			const totalBookWeight = copyArraySafe(explorerBookCatalog).reduce(function (sum, entry) { return sum + (Number(entry && entry.weight) || 0); }, 0);
			const totalBookWdl = sumWdlFromEntries(explorerBookCatalog);
			const familyEntries = recognized
				? copyArraySafe(explorerBookCatalog).filter(function (entry) { return entry.family === recognized.family; })
				: [];
			const familyWeight = familyEntries.reduce(function (sum, entry) { return sum + (Number(entry && entry.weight) || 0); }, 0);
			const familyWdl = sumWdlFromEntries(familyEntries);
			const topFamilies = buildTopFamilies(explorerBookCatalog);
			return [
				'<div class="opening-stat-grid">',
				renderMetricCard('Recognized ECO', recognized ? (recognized.eco || '-') : 'Unrecognized'),
				renderMetricCard('Played plies', String(history.length)),
				renderMetricCard('Current branches', String(nextMoves.length)),
				renderMetricCard('Current WDL', formatWdlCompact(currentWdl)),
				renderMetricCard('Book entries', String(copyArraySafe(explorerBookCatalog).length)),
				renderMetricCard('Book WDL', formatWdlCompact(totalBookWdl)),
				renderMetricCard('Family lines', recognized ? String(familyEntries.length) : '0'),
				renderMetricCard('Family WDL', recognized ? formatWdlCompact(familyWdl) : '0/0/0'),
				'</div>',
				'<div class="opening-explorer-grid stats-grid">',
				'<section class="play-panel">',
				'<h3 class="play-panel-title">Current Position WDL</h3>',
				(currentWdl && currentWdl.total
					? renderWdlBreakdown(currentWdl, 'Current position')
					: '<div class="engine-summary-empty">No current-position WDL is available until the line reaches a stored book node.</div>'),
				'</section>',
				'<section class="play-panel">',
				'<h3 class="play-panel-title">Current Move WDL</h3>',
				(nextMoves.length
					? '<div class="opening-transposition-list">' + nextMoves.slice(0, 10).map(renderMoveWdlStat).join('') + '</div>'
					: '<div class="engine-summary-empty">No move-level WDL is available until the current line reaches a stored book position.</div>'),
				'</section>',
				'<section class="play-panel">',
				'<h3 class="play-panel-title">Top Book Families</h3>',
				(topFamilies.length
					? '<div class="opening-transposition-list">' + topFamilies.map(renderFamilyStat).join('') + '</div>'
					: '<div class="engine-summary-empty">No family coverage statistics are available.</div>'),
				'</section>',
				'<section class="play-panel">',
				'<h3 class="play-panel-title">Recognition Snapshot</h3>',
				(recognized
					? '<div class="opening-transposition-item"><div class="opening-transposition-head"><span class="opening-eco">' + escapeHtml(recognized.eco || '-') + '</span><span class="opening-weight">' + escapeHtml(recognized.wdlSummary || '') + '</span></div><div class="opening-transposition-copy">' + escapeHtml(recognized.label || recognized.name || 'Recognized opening') + '</div><div class="opening-move-meta">Matched ply ' + escapeHtml(String(recognized.matchedPly || 0)) + ' • family size ' + escapeHtml(String(recognized.familySize || 1)) + ' • family share ' + escapeHtml(totalBookWeight ? formatPercent(familyWeight, totalBookWeight) : '0%') + '</div></div>'
					: '<div class="engine-summary-empty">No opening is currently recognized, so only global book statistics are available.</div>'),
				'</section>',
				'</div>',
			].join('');
		}

		function getFilteredCatalog(sourceCatalog) {
			const catalog = Array.isArray(sourceCatalog) ? sourceCatalog : Array.isArray(lastSnapshot && lastSnapshot.ecoCatalog) ? lastSnapshot.ecoCatalog : [];
			return filterEcoCatalog(catalog, ecoLetter, ecoSearch);
		}

		function filterEcoCatalog(catalog, letter, query) {
			const normalizedQuery = String(query || '').trim().toLowerCase();
			return catalog.filter(function (entry) {
				if (letter && letter !== 'all' && String(entry.eco || '').charAt(0) !== letter) return false;
				if (!normalizedQuery) return true;
				const haystack = [entry.eco, entry.name, entry.group, entry.description, formatAliases(entry.aliases)].join(' ').toLowerCase();
				return haystack.includes(normalizedQuery);
			});
		}

		function captureEcoSearchState(root) {
			const activeElement = document.activeElement;
			if (!activeElement || !root.contains(activeElement) || !activeElement.matches('[data-eco-search]')) {
				return null;
			}

			return {
				selectionStart: typeof activeElement.selectionStart === 'number' ? activeElement.selectionStart : null,
				selectionEnd: typeof activeElement.selectionEnd === 'number' ? activeElement.selectionEnd : null,
			};
		}

		function restoreEcoSearchState(root, searchState) {
			const searchInput = root.querySelector('[data-eco-search]');
			if (!searchInput) return;
			if (!searchState && !pendingFocusSearch) return;

			searchInput.focus({ preventScroll: true });
			if (searchState && typeof searchState.selectionStart === 'number' && typeof searchState.selectionEnd === 'number') {
				const selectionStart = Math.min(searchState.selectionStart, searchInput.value.length);
				const selectionEnd = Math.min(searchState.selectionEnd, searchInput.value.length);
				searchInput.setSelectionRange(selectionStart, selectionEnd);
			} else {
				const end = searchInput.value.length;
				searchInput.setSelectionRange(end, end);
			}

			pendingFocusSearch = false;
		}

		function restoreEcoSelectionScroll(root) {
			if (!pendingScrollSelection) return;
			const activeButton = root.querySelector('.opening-eco-row.active');
			if (activeButton && typeof activeButton.scrollIntoView === 'function') {
				activeButton.scrollIntoView({ block: 'nearest' });
			}
			pendingScrollSelection = false;
		}

		function restoreBookSelectionScroll(root) {
			if (!pendingScrollBookSelection) return;
			const activeButton = root.querySelector('.opening-book-row.active');
			if (activeButton && typeof activeButton.scrollIntoView === 'function') {
				activeButton.scrollIntoView({ block: 'nearest' });
			}
			pendingScrollBookSelection = false;
		}

		function moveEcoSelection(delta) {
			const filteredCatalog = getFilteredCatalog();
			if (!filteredCatalog.length) return;
			let currentIndex = filteredCatalog.findIndex(entry => entry.eco === selectedEco);
			if (currentIndex < 0) currentIndex = 0;
			const nextIndex = clamp(currentIndex + delta, 0, filteredCatalog.length - 1);
			selectedEco = filteredCatalog[nextIndex].eco;
			pendingFocusSearch = true;
			pendingScrollSelection = true;
			render(lastSnapshot);
		}

		function getFilteredBookCatalog(sourceCatalog) {
			const catalog = Array.isArray(sourceCatalog) ? sourceCatalog : Array.isArray(lastSnapshot && lastSnapshot.explorerBookCatalog) ? lastSnapshot.explorerBookCatalog : [];
			return filterBookCatalog(catalog, bookLetter, bookSearch);
		}

		function filterBookCatalog(catalog, letter, query) {
			const normalizedQuery = String(query || '').trim().toLowerCase();
			return copyArraySafe(catalog)
				.filter(function (entry) {
					if (letter && letter !== 'all' && String(entry && entry.eco || '').charAt(0) !== letter) return false;
					if (!normalizedQuery) return true;
					const haystack = [
						entry && entry.eco,
						entry && entry.label,
						entry && entry.familyLabel,
						entry && entry.moveText,
						formatAliases(entry && entry.aliases),
					].join(' ').toLowerCase();
					return haystack.includes(normalizedQuery);
				})
				.sort(function (left, right) {
					return (Number(right && right.weight) || 0) - (Number(left && left.weight) || 0)
						|| String(left && left.label || '').localeCompare(String(right && right.label || ''));
				});
		}

		function resolveSelectedBook(catalog, recognized) {
			if (selectedBookKey && catalog.some(function (entry) { return entry.key === selectedBookKey; })) return selectedBookKey;
			if (recognized && recognized.key && catalog.some(function (entry) { return entry.key === recognized.key; })) {
				selectedBookKey = recognized.key;
				return selectedBookKey;
			}
			selectedBookKey = catalog.length ? catalog[0].key : null;
			return selectedBookKey;
		}

		function resolveSelectedEco(catalog, recognized) {
			if (selectedEco && catalog.some(entry => entry.eco === selectedEco)) return selectedEco;
			if (recognized && recognized.eco && catalog.some(entry => entry.eco === recognized.eco)) {
				selectedEco = recognized.eco;
				return selectedEco;
			}
			selectedEco = catalog.length ? catalog[0].eco : null;
			return selectedEco;
		}

		function renderBookBrowser(catalog, fullCatalog, activeEntry, recognized) {
			const letters = ['all', 'A', 'B', 'C', 'D', 'E'];
			const totalLines = Array.isArray(fullCatalog) ? fullCatalog.length : catalog.length;
			const summaryParts = [String(catalog.length) + ' of ' + String(totalLines) + ' lines'];
			if (bookLetter !== 'all') summaryParts.push('letter ' + bookLetter);
			if (String(bookSearch || '').trim()) summaryParts.push('search ' + JSON.stringify(String(bookSearch).trim()));

			return [
				'<section class="openings-panel openings-encyclopedia-panel">',
				'<div class="openings-header">',
				'<div>',
				'<h2>Polyglot Book Browser</h2>',
				'<p>Filter stored opening lines by ECO range or text and inspect concrete WDL summaries for each line.</p>',
				'</div>',
				'<div class="opening-encyclopedia-count">' + escapeHtml(String(catalog.length)) + ' matches</div>',
				'</div>',
				'<div class="opening-encyclopedia-toolbar">',
				'<div class="opening-encyclopedia-search-row">',
				'<div class="opening-encyclopedia-search-wrap">',
				'<input type="search" class="opening-encyclopedia-search" data-book-search="true" placeholder="Search ECO, opening, family, alias, or move text" value="' + escapeHtml(bookSearch) + '">',
				(String(bookSearch || '').trim() ? '<button type="button" class="opening-encyclopedia-clear" data-book-clear-search="true" aria-label="Clear book search">Clear</button>' : ''),
				'</div>',
				(recognized && recognized.key ? '<button type="button" class="opening-letter-btn" data-book-jump-current="true">Jump To Current (' + escapeHtml(recognized.eco || '-') + ')</button>' : ''),
				'</div>',
				'<div class="opening-encyclopedia-letters">' + letters.map(function (letter) {
					const isActive = bookLetter === letter;
					const label = letter === 'all' ? 'All' : letter;
					return '<button type="button" class="opening-letter-btn' + (isActive ? ' active' : '') + '" data-book-letter="' + escapeHtml(letter) + '">' + escapeHtml(label) + '</button>';
				}).join('') + '</div>',
				'<div class="opening-encyclopedia-status">' + escapeHtml(summaryParts.join(' • ')) + '</div>',
				'</div>',
				'<div class="opening-encyclopedia-grid">',
				'<div class="opening-encyclopedia-list">' + renderBookCatalogList(catalog, recognized) + '</div>',
				'<div class="opening-encyclopedia-detail">' + renderBookDetail(activeEntry, recognized) + '</div>',
				'</div>',
				'</section>',
			].join('');
		}

		function renderBookCatalogList(catalog, recognized) {
			if (!catalog.length) {
				return '<div class="engine-summary-empty">No opening-book lines match the current filter. Clear the search or switch the ECO range.</div>';
			}
			return catalog.map(function (entry) {
				const isSelected = selectedBookKey === entry.key;
				const isCurrent = Boolean(recognized && recognized.key === entry.key);
				const uciLine = Array.isArray(entry.moves) ? entry.moves.join(' ') : '';
				return '<button type="button" class="opening-eco-row opening-book-row' + (isSelected ? ' active' : '') + (isCurrent ? ' current' : '') + '" data-book-key="' + escapeHtml(entry.key || '') + '"' + (uciLine ? ' data-book-load-line="' + escapeHtml(uciLine) + '"' : '') + ' title="' + escapeHtml(entry.label || entry.familyLabel || 'Book line') + '"><span class="opening-eco">' + escapeHtml(entry.eco || '-') + '</span><span class="opening-eco-copy"><span class="opening-name">' + highlightMatch(entry.label || entry.familyLabel || 'Book line', bookSearch) + '</span><span class="opening-move-meta">' + highlightMatch(entry.moveText || '', bookSearch) + '</span></span><span class="opening-weight">' + escapeHtml(entry.wdlSummary || formatWdlCompact(entry.wdl)) + '</span></button>';
			}).join('');
		}

		function renderBookDetail(entry, recognized) {
			if (!entry) {
				return '<div class="engine-summary-empty">Select a book line to inspect its stored continuation and WDL snapshot.</div>';
			}

			const uciLine = Array.isArray(entry.moves) ? entry.moves.join(' ') : '';
			const detailChips = [
				renderStatChip('Weight', String(entry.weight || 0)),
				renderStatChip('Family', entry.familyLabel || entry.family || '-'),
				renderStatChip('WDL', entry.wdlSummary || formatWdlCompact(entry.wdl)),
			];
			if (entry.wdl && entry.wdl.cp != null) detailChips.push(renderStatChip('Eval', formatCpEval(entry.wdl.cp)));
			if (recognized && recognized.key === entry.key) detailChips.push(renderStatChip('Current game', 'Matched'));

			return [
				'<div class="opening-badge large"><span class="opening-eco">' + escapeHtml(entry.eco || '-') + '</span><span class="opening-name">' + highlightMatch(entry.label || entry.familyLabel || 'Book line', bookSearch) + '</span><span class="opening-weight">' + escapeHtml(entry.wdlSummary || formatWdlCompact(entry.wdl)) + '</span></div>',
				'<div class="opening-stat-chips">' + detailChips.join('') + '</div>',
				renderAliasMeta(entry.aliases, 'Aliases', bookSearch),
				'<section class="opening-detail-section"><div class="opening-detail-section-title">Stored line</div><div class="engine-pv">' + highlightMatch(entry.moveText || 'No move text stored for this line.', bookSearch) + '</div></section>',
				'<section class="opening-detail-section"><div class="opening-detail-section-title">Result percentages</div>' + renderWdlBreakdown(entry.wdl, 'Book line') + '</section>',
				(uciLine ? '<div class="opening-actions"><button type="button" class="play-action-btn" data-eco-load-line="' + escapeHtml(uciLine) + '">Load Into Explorer</button></div>' : ''),
			].join('');
		}

		function renderEcoBrowser(catalog, fullCatalog, activeEntry, recognized) {
			const letters = ['all', 'A', 'B', 'C', 'D', 'E'];
			const matchedLineCount = catalog.reduce((sum, entry) => sum + (entry.entryCount || 0), 0);
			const totalCodes = Array.isArray(fullCatalog) ? fullCatalog.length : catalog.length;
			const summaryParts = [
				String(catalog.length) + ' of ' + String(totalCodes) + ' codes',
				String(matchedLineCount) + ' recorded lines',
			];
			if (ecoLetter !== 'all') summaryParts.push('letter ' + ecoLetter);
			if (String(ecoSearch || '').trim()) summaryParts.push('search ' + JSON.stringify(String(ecoSearch).trim()));

			return [
				'<section class="openings-panel openings-encyclopedia-panel">',
				'<div class="openings-header">',
				'<div>',
				'<h2>ECO Encyclopedia</h2>',
				'<p>Browse the full A00-E99 code index, filter by letter, and inspect any exact book lines stored for a code.</p>',
				'</div>',
				'<div class="opening-encyclopedia-count">' + escapeHtml(String(catalog.length)) + ' matches</div>',
				'</div>',
				'<div class="opening-encyclopedia-toolbar">',
				'<div class="opening-encyclopedia-search-row">',
				'<div class="opening-encyclopedia-search-wrap">',
				'<input type="search" class="opening-encyclopedia-search" data-eco-search="true" placeholder="Search code, opening, family, or alias" value="' + escapeHtml(ecoSearch) + '">',
				(String(ecoSearch || '').trim() ? '<button type="button" class="opening-encyclopedia-clear" data-eco-clear-search="true" aria-label="Clear ECO search">Clear</button>' : ''),
				'</div>',
				(recognized && recognized.eco ? '<button type="button" class="opening-letter-btn" data-eco-jump-current="true">Jump To Current (' + escapeHtml(recognized.eco) + ')</button>' : ''),
				'</div>',
				'<div class="opening-encyclopedia-letters">' + letters.map(function (letter) {
					const isActive = ecoLetter === letter;
					const label = letter === 'all' ? 'All' : letter;
					return '<button type="button" class="opening-letter-btn' + (isActive ? ' active' : '') + '" data-eco-letter="' + escapeHtml(letter) + '">' + escapeHtml(label) + '</button>';
				}).join('') + '</div>',
				'<div class="opening-encyclopedia-status">' + escapeHtml(summaryParts.join(' • ')) + '</div>',
				'</div>',
				'<div class="opening-encyclopedia-grid">',
				'<div class="opening-encyclopedia-list">' + renderEcoCatalogList(catalog, recognized) + '</div>',
				'<div class="opening-encyclopedia-detail">' + renderEcoDetail(activeEntry, recognized) + '</div>',
				'</div>',
				'</section>'
			].join('');
		}

		function renderEcoCatalogList(catalog, recognized) {
			if (!catalog.length) {
				return '<div class="engine-summary-empty">No ECO codes match the current filter. Clear the search or switch the letter range.</div>';
			}
			return catalog.map(function (entry) {
				const isSelected = selectedEco === entry.eco;
				const isCurrent = Boolean(recognized && recognized.eco === entry.eco);
				const aliasPreview = copyArraySafe(entry.aliases, 3);
				return '<button type="button" class="opening-eco-row' + (isSelected ? ' active' : '') + (isCurrent ? ' current' : '') + '" data-eco-code="' + escapeHtml(entry.eco) + '" title="' + escapeHtml(entry.name || entry.group || 'Opening') + '"><span class="opening-eco">' + escapeHtml(entry.eco) + '</span><span class="opening-eco-copy"><span class="opening-name">' + highlightMatch(entry.name || entry.group || 'Opening', ecoSearch) + '</span><span class="opening-move-meta">' + highlightMatch(entry.group || '', ecoSearch) + '</span>' + (aliasPreview.length ? '<span class="opening-eco-alias-preview">' + aliasPreview.map(function (alias) { return highlightMatch(alias, ecoSearch); }).join(' • ') + '</span>' : '') + '</span><span class="opening-weight">' + escapeHtml(entry.entryCount ? String(entry.entryCount) + ' line' + (entry.entryCount === 1 ? '' : 's') : 'Index') + '</span></button>';
			}).join('');
		}

		function renderEcoDetail(entry, recognized) {
			if (!entry) {
				return '<div class="engine-summary-empty">Select an ECO code to inspect it.</div>';
			}

			const lines = Array.isArray(entry.lines) ? entry.lines : [];
			const aliasCount = copyArraySafe(entry.aliases).length;
			const detailChips = [
				renderStatChip('Group', entry.group || '-'),
				renderStatChip('Recorded', String(lines.length) + ' line' + (lines.length === 1 ? '' : 's')),
			];
			if (aliasCount) detailChips.push(renderStatChip('Aliases', String(aliasCount)));
			if (recognized && recognized.eco === entry.eco) detailChips.push(renderStatChip('Current game', 'Matched'));

			const primaryLine = lines[0] && Array.isArray(lines[0].moves) ? lines[0].moves.join(' ') : '';
			return [
				'<div class="opening-badge large"><span class="opening-eco">' + escapeHtml(entry.eco || '-') + '</span><span class="opening-name">' + highlightMatch(entry.name || entry.group || 'Opening', ecoSearch) + '</span><span class="opening-weight">' + escapeHtml(lines.length ? String(lines.length) + ' exact lines' : 'Code index') + '</span></div>',
				'<div class="opening-stat-chips">' + detailChips.join('') + '</div>',
				renderAliasMeta(entry.aliases, 'Search aliases'),
				'<section class="opening-detail-section"><div class="opening-detail-section-title">Description</div><div class="engine-pv">' + highlightMatch(entry.description || 'No description available for this ECO code.', ecoSearch) + '</div></section>',
				(primaryLine ? '<div class="opening-actions"><button type="button" class="play-action-btn" data-eco-load-line="' + escapeHtml(primaryLine) + '">Load Primary Line</button></div>' : ''),
				(lines.length
					? '<section class="opening-detail-section"><div class="opening-detail-section-title">Recorded Lines</div><div class="opening-transposition-list">' + lines.map(renderEcoLine).join('') + '</div></section>'
					: '<div class="engine-summary-empty">This code is available in the full ECO index, but no exact move tree is stored in the current explorer book for it yet.</div>')
			].join('');
		}

		function renderEcoLine(line) {
			const uciLine = Array.isArray(line && line.moves) ? line.moves.join(' ') : '';
			const lineText = line && (line.pgnText || line.moveText) ? (line.pgnText || line.moveText) : 'No move text stored';
			return '<div class="opening-transposition-item"><div class="opening-transposition-head"><span class="opening-eco">' + escapeHtml(line.eco || '-') + '</span><span class="opening-weight">' + escapeHtml(line.popularity || '') + '</span></div><div class="opening-transposition-copy">' + highlightMatch(line.label || line.familyLabel || 'Opening line', ecoSearch) + '</div>' + renderAliasMeta(line.aliases, 'Also known as') + '<div class="opening-move-meta">' + highlightMatch(lineText, ecoSearch) + '</div>' + (uciLine ? '<div class="opening-actions"><button type="button" class="play-action-btn" data-eco-load-line="' + escapeHtml(uciLine) + '">Load Into Explorer</button></div>' : '') + '</div>';
		}

		function renderAliasMeta(aliases, label, query) {
			const list = copyArraySafe(aliases);
			if (!list.length) return '';
			return '<section class="opening-detail-section"><div class="opening-detail-section-title">' + escapeHtml(label || 'Aliases') + '</div><div class="opening-alias-list">' + list.map(function (alias) {
				return '<span class="opening-alias-chip">' + highlightMatch(alias, query != null ? query : ecoSearch) + '</span>';
			}).join('') + '</div></section>';
		}

		function formatAliases(aliases) {
			return copyArraySafe(aliases).filter(Boolean).join(' • ');
		}

		function renderExplorerMove(move) {
			const title = move && move.primary ? move.primary.label : 'Opening explorer move';
			const families = move ? copyArraySafe(move.families, 2).map(item => item.familyLabel).join(' / ') : '';
			const meta = [];
			if (move && move.popularity) meta.push(move.popularity);
			if (move && move.primary && move.primary.eco) meta.push(move.primary.eco + ' ' + move.primary.label);
			if (families) meta.push(families);
			return '<button type="button" class="opening-move-btn wide" data-opening-move="' + escapeHtml(move.uci || '') + '" title="' + escapeHtml(title) + '"><span class="opening-move-main"><span class="opening-move-label">' + escapeHtml(move.display || move.uci || '-') + '</span><span class="opening-move-meta">' + escapeHtml(meta.join(' • ')) + '</span></span>' + renderBookBar(move) + '</button>';
		}

		function renderHistoryMove(entry, index) {
			return '<button type="button" class="opening-history-item" data-opening-index="' + String(index) + '"><span class="opening-history-ply">' + String(index + 1) + '.</span><span class="opening-history-san">' + escapeHtml(entry.san || entry.uci || '-') + '</span><span class="opening-history-uci">' + escapeHtml(entry.uci || '-') + '</span></button>';
		}

		function renderTransposition(item) {
			return '<div class="opening-transposition-item"><div class="opening-transposition-head"><span class="opening-eco">' + escapeHtml(item.eco || '-') + '</span><span class="opening-weight">' + escapeHtml(item.popularity || '') + '</span></div><div class="opening-transposition-copy">' + escapeHtml(item.label || '-') + '</div><div class="opening-move-meta">' + escapeHtml(item.moveText || '-') + '</div></div>';
		}

		function renderBookBar(move) {
			const percent = Math.max(0, Math.min(100, Number(move && move.barPercent) || 0));
			return '<span class="opening-book-bar-wrap"><span class="opening-book-bar"><span class="opening-book-bar-fill" style="width:' + String(percent) + '%"></span></span><span class="opening-book-bar-value">' + escapeHtml(move && move.popularity ? move.popularity : '0%') + '</span></span>';
		}

		function renderStatChip(label, value) {
			return '<span class="opening-stat-chip"><strong>' + escapeHtml(label) + ':</strong> ' + escapeHtml(value) + '</span>';
		}

		function renderBookEntry(entry) {
			const uciLine = Array.isArray(entry && entry.moves) ? entry.moves.join(' ') : '';
			return '<div class="opening-transposition-item"><div class="opening-transposition-head"><span class="opening-eco">' + escapeHtml(entry && entry.eco ? entry.eco : '-') + '</span><span class="opening-weight">' + escapeHtml(entry && entry.weight != null ? String(entry.weight) : '') + '</span></div><div class="opening-transposition-copy">' + escapeHtml(entry && entry.label ? entry.label : 'Book line') + '</div><div class="opening-move-meta">' + escapeHtml(entry && entry.moveText ? entry.moveText : '-') + '</div>' + (uciLine ? '<div class="opening-actions"><button type="button" class="play-action-btn" data-eco-load-line="' + escapeHtml(uciLine) + '">Load Into Explorer</button></div>' : '') + '</div>';
		}

		function sumWdlFromEntries(entries) {
			return copyArraySafe(entries).reduce(function (sum, entry) {
				const wdl = entry && entry.wdl ? entry.wdl : entry;
				sum.white += Math.max(0, Number(wdl && wdl.white) || 0);
				sum.draws += Math.max(0, Number(wdl && wdl.draws) || 0);
				sum.black += Math.max(0, Number(wdl && wdl.black) || 0);
				sum.total += Math.max(0, Number(wdl && wdl.total) || 0);
				if (!sum.source && wdl && wdl.source) sum.source = String(wdl.source);
				return sum;
			}, { white: 0, draws: 0, black: 0, total: 0, source: '' });
		}

		function formatWdlCompact(wdl) {
			const safe = sumWdlFromEntries([wdl]);
			if (!safe.total) return 'W 0% • D 0% • L 0%';
			return 'W ' + formatPercent(safe.white, safe.total) + ' • D ' + formatPercent(safe.draws, safe.total) + ' • L ' + formatPercent(safe.black, safe.total);
		}

		function renderWdlBreakdown(wdl, label) {
			const safe = sumWdlFromEntries([wdl]);
			return [
				'<div class="opening-wdl-panel">',
				label ? '<div class="opening-move-meta">' + escapeHtml(label) + (safe.source ? ' • ' + escapeHtml(safe.source) : '') + '</div>' : '',
				'<div class="opening-wdl-bars">',
				renderWdlBar('White', safe.white, safe.total, 'white'),
				renderWdlBar('Draw', safe.draws, safe.total, 'draw'),
				renderWdlBar('Black', safe.black, safe.total, 'black'),
				'</div>',
				(wdl != null && wdl.cp != null && isFinite(Number(wdl.cp)) ? renderCpBar(Number(wdl.cp)) : ''),
				'</div>',
			].join('');
		}

		function renderWdlBar(label, value, total, tone) {
			const percentText = formatPercent(value, total);
			const width = total ? Math.max(0, Math.min(100, (Number(value) || 0) * 100 / total)) : 0;
			return '<div class="opening-wdl-row"><div class="opening-wdl-head"><span>' + escapeHtml(label) + '</span><span>' + escapeHtml(percentText) + ' • ' + escapeHtml(String(Number(value) || 0)) + '</span></div><div class="opening-wdl-track"><span class="opening-wdl-fill ' + escapeHtml(tone) + '" style="width:' + String(width.toFixed(2)) + '%"></span></div></div>';
		}

		function formatCpEval(cp) {
			if (cp == null || !isFinite(Number(cp))) return '?';
			const pawns = Number(cp) / 100;
			if (cp === 0) return '=';
			return (cp > 0 ? '+' : '') + pawns.toFixed(2);
		}

		function renderCpBar(cp) {
			const label = formatCpEval(cp);
			const whitePct = Math.max(5, Math.min(95, 50 + cp / 6));
			return [
				'<div class="opening-cp-row">',
				'<div class="opening-cp-head"><span>Engine eval</span><span>' + escapeHtml(label) + '</span></div>',
				'<div class="opening-cp-track">',
				'<span class="opening-cp-fill white" style="width:' + whitePct.toFixed(2) + '%"></span>',
				'<span class="opening-cp-fill black" style="width:' + (100 - whitePct).toFixed(2) + '%"></span>',
				'</div>',
				'</div>',
			].join('');
		}

		function renderMoveWdlStat(move) {
			return '<div class="opening-transposition-item"><div class="opening-transposition-head"><span class="opening-eco">' + escapeHtml(move && (move.display || move.uci) ? (move.display || move.uci) : '-') + '</span><span class="opening-weight">' + escapeHtml(move && move.wdlSummary ? move.wdlSummary : formatWdlCompact(move && move.wdl)) + '</span></div><div class="opening-transposition-copy">' + escapeHtml(move && move.primary && move.primary.label ? move.primary.label : 'Stored continuation') + '</div>' + renderWdlBreakdown(move && move.wdl, '') + '</div>';
		}

		function buildTopFamilies(entries) {
			const totals = new Map();
			copyArraySafe(entries).forEach(function (entry) {
				const familyKey = entry && entry.family ? entry.family : 'unknown';
				if (!totals.has(familyKey)) {
					totals.set(familyKey, {
						family: familyKey,
						familyLabel: entry && (entry.familyLabel || entry.name) ? (entry.familyLabel || entry.name) : 'Unknown family',
						weight: 0,
						count: 0,
						wdl: { white: 0, draws: 0, black: 0, total: 0, source: '' },
					});
				}
				const item = totals.get(familyKey);
				item.weight += Number(entry && entry.weight) || 0;
				item.count += 1;
				const wdl = sumWdlFromEntries([entry && entry.wdl]);
				item.wdl.white += wdl.white;
				item.wdl.draws += wdl.draws;
				item.wdl.black += wdl.black;
				item.wdl.total += wdl.total;
				if (!item.wdl.source && wdl.source) item.wdl.source = wdl.source;
			});
			const totalWeight = Array.from(totals.values()).reduce(function (sum, item) { return sum + item.weight; }, 0) || 1;
			return Array.from(totals.values())
				.sort(function (left, right) { return right.weight - left.weight || left.familyLabel.localeCompare(right.familyLabel); })
				.slice(0, 10)
				.map(function (item) {
					return Object.assign({}, item, { share: formatPercent(item.weight, totalWeight), wdlSummary: formatWdlCompact(item.wdl) });
				});
		}

		function renderFamilyStat(item) {
			return '<div class="opening-transposition-item"><div class="opening-transposition-head"><span class="opening-eco">' + escapeHtml(String(item.count)) + ' lines</span><span class="opening-weight">' + escapeHtml(item.share || '0%') + '</span></div><div class="opening-transposition-copy">' + escapeHtml(item.familyLabel || item.family || 'Unknown family') + '</div><div class="opening-move-meta">' + escapeHtml(item.wdlSummary || formatWdlCompact(item.wdl)) + ' • book weight ' + escapeHtml(String(item.weight || 0)) + '</div></div>';
		}

		function renderMetricCard(label, value) {
			return '<div class="opening-metric-card"><span class="opening-metric-label">' + escapeHtml(label) + '</span><strong class="opening-metric-value">' + escapeHtml(value) + '</strong></div>';
		}

		function formatPercent(value, total) {
			const safeTotal = Number(total) || 0;
			if (!safeTotal) return '0%';
			const percent = (Number(value) || 0) * 100 / safeTotal;
			return percent >= 10 ? percent.toFixed(0) + '%' : percent.toFixed(1) + '%';
		}

		function highlightMatch(text, query) {
			const value = String(text || '');
			const tokens = getSearchTokens(query);
			if (!value || !tokens.length) return escapeHtml(value);

			const lower = value.toLowerCase();
			const ranges = [];
			for (const token of tokens) {
				let searchIndex = 0;
				while (searchIndex < lower.length) {
					const foundIndex = lower.indexOf(token, searchIndex);
					if (foundIndex === -1) break;
					ranges.push([foundIndex, foundIndex + token.length]);
					searchIndex = foundIndex + token.length;
				}
			}

			if (!ranges.length) return escapeHtml(value);
			ranges.sort(function (left, right) { return left[0] - right[0] || left[1] - right[1]; });
			const merged = [];
			for (const range of ranges) {
				if (!merged.length || range[0] > merged[merged.length - 1][1]) {
					merged.push(range.slice());
					continue;
				}
				merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], range[1]);
			}

			let cursor = 0;
			let html = '';
			for (const range of merged) {
				html += escapeHtml(value.slice(cursor, range[0]));
				html += '<mark class="opening-match">' + escapeHtml(value.slice(range[0], range[1])) + '</mark>';
				cursor = range[1];
			}
			html += escapeHtml(value.slice(cursor));
			return html;
		}

		function getSearchTokens(query) {
			const seen = new Set();
			return String(query || '')
				.trim()
				.toLowerCase()
				.split(/\s+/)
				.filter(function (token) {
					if (!token || seen.has(token)) return false;
					seen.add(token);
					return true;
				});
		}

		function getRecognizedFromSnapshot(snapshot) {
			const opening = snapshot && snapshot.opening ? snapshot.opening : null;
			return opening && opening.recognized ? opening.recognized : null;
		}

		function copyArraySafe(value, limit) {
			if (!Array.isArray(value)) return [];
			if (typeof limit === 'number') return value.slice(0, limit);
			return value.slice();
		}

		function clamp(value, min, max) {
			return Math.min(Math.max(value, min), max);
		}

		return {
			init,
			render,
		};
	}

	function escapeHtml(value) {
		return String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	global.Chess2OpeningsView = { create };
})(window);