// Ref:
// https://blog.laplante.io/2014/11/parsing-html-c-revisited/

#include <curl/curl.h>
#include <iostream>
#include <string>

using namespace std;

int on_write(char *data, size_t size, size_t len, string *buf) {
    if (buf == NULL)
        return 0;
    buf->append(data, size * len);
    return size * len;
}

string http_get(string url, string query) {
    // https://curl.haxx.se/libcurl/c/
    CURL *curl = curl_easy_init();
    char *enc_query = curl_easy_escape(curl, query.c_str(), query.length());
    url.append(enc_query);
    curl_free(enc_query);
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    string buf;
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &buf);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, on_write);
    CURLcode code = curl_easy_perform(curl);
    curl_easy_cleanup(curl);
    return code == CURLE_OK ? buf : "";
}

int main(int argc, char *argv[]) {
    string query = "\"command line\"";
    string url = "https://www.dict.cc/?s=";

    string body = http_get(url, query);
    if (body == "")
        return 1;

    // TODO: Parse HTML using libxml2

    // cout << body << endl;
    return 0;
}
