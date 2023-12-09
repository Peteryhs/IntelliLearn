from youtubesearchpython import VideosSearch

def search_youtube(keyword):
    try:
        video_search = VideosSearch(keyword, limit = 1)
        results = video_search.result()
        if results["result"]:
            top_result = results["result"][0]
            video_id = top_result["id"]
            youtube_link = f"https://www.youtube.com/watch?v={video_id}"
            print("Top result on YouTube:", youtube_link)
            return youtube_link
        else:
            print("No results found on YouTube.")
    except Exception as e:
        print(f"An error occurred: {e}")

search_keyword = input("Enter the keyword to search on YouTube: ")
search_youtube(search_keyword)