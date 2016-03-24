/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
  /* This is our first test suite - a test suite just contains
   * a related set of tests. This suite is all about the RSS
   * feeds definitions, the allFeeds variable in our application.
   */
  describe('RSS Feeds', function() {
    /* This is our first test - it tests to make sure that the
     * allFeeds variable has been defined and that it is not
     * empty.
     */
    it('are defined', function() {
      expect(allFeeds).toBeDefined();
      expect(allFeeds.length).not.toBe(0);
    });


    /* A test that loops through each feed
     * in the allFeeds object and ensures it has a URL defined
     * and that the URL is not empty.
     */
    it('each feed\'s URL is defined', function() {
      expect(allFeeds).toBeDefined();
      allFeeds.forEach(function(feed) {
        expect(feed.url).toBeDefined();
        expect(feed.url).not.toBe('');
      });
    });


    /*A test that loops through each feed
     * in the allFeeds object and ensures it has a name defined
     * and that the name is not empty.
     */
    it('each feed\'s name is defined', function() {
      expect(allFeeds).toBeDefined();
      allFeeds.forEach(function(feed) {
        expect(feed.name).toBeDefined();
        expect(feed.name).not.toBe('');
      });
    });
  });

  /* A new test suite named "The menu" */
  describe('The menu', function() {

    /* A test that ensures the menu element is
     * hidden by default. You'll have to analyze the HTML and
     * the CSS to determine how we're performing the
     * hiding/showing of the menu element.
     */
    it('is hidden by default', function() {
      expect(document.body.className).toBe('menu-hidden');
    });


    /* A test that ensures the menu changes
     * visibility when the menu icon is clicked. This test
     * should have two expectations: does the menu display when
     * clicked and does it hide when clicked again.
     */
    it('change visibility when the icon is clicked', function() {
      $('.menu-icon-link').click();
      expect(document.body.className).not.toBe('menu-hidden');

      $('.menu-icon-link').click();
      expect(document.body.className).toBe('menu-hidden');
    });

  });

  /* A new test suite named "Initial Entries" */
  describe('Initial Entries', function() {

    /* A test that ensures when the loadFeed
     * function is called and completes its work, there is at least
     * a single .entry element within the .feed container.
     * Remember, loadFeed() is asynchronous so this test will require
     * the use of Jasmine's beforeEach and asynchronous done() function.
     */
    beforeEach(function(done) {
      expect(allFeeds).toBeDefined();
      expect(allFeeds.length).not.toBeLessThan(1);
      // Call loadFeed asynchronous
      loadFeed(0, function() {
        done();
      });
    });

    it('should has at least one element', function(done) {
      expect($('.feed .entry')).toBeDefined();
      expect($('.feed .entry').length).not.toBe(0);
      done();
    });

  });

  /* Write a new test suite named "New Feed Selection" */
  describe('New Feed Selection', function() {

    /* A test that ensures when a new feed is loaded
     * by the loadFeed function that the content actually changes.
     */
    var OldEntryName = '';
    var newEntryName = '';
    beforeEach(function(done) {
      expect(allFeeds).toBeDefined();
      expect(allFeeds.length).not.toBeLessThan(2);

      loadFeed(1, function() {
        // Check that feeds have been load
        // Save initial feed container's fist entry content
        expect($('.feed .entry')).toBeDefined();
        expect($('.feed .entry').length).not.toBe(0);
        oldEntryName = $('.feed .entry:first').text();
        expect(oldEntryName).not.toBe('');

        loadFeed(0, function() {
          // Check that feeds have been load
          // Save second time's feed container's fist entry content
          expect($('.feed .entry')).toBeDefined();
          expect($('.feed .entry').length).not.toBe(0);
          newEntryName = $('.feed .entry:first').text();
          expect(newEntryName).not.toBe('');

          done();
        });
      });
    });

    it('should change the content', function(done) {
      // Test if entryName have be changed
      expect(newEntryName).not.toBe(oldEntryName);
      done();
    });
  });

}());
