#include <cstring>
#include <curl/curl.h>
#include <iostream>
#include <libxml/HTMLparser.h>
#include <string>

using namespace std;

int on_write(char *data, size_t size, size_t len, string *buf) {
    if (buf == NULL)
        return 0;
    buf->append(data, size * len);
    return size * len;
}

string http_get(string url, string query) {
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

void on_start_element(void *ctx, const xmlChar *name, const xmlChar **atts) {
    if (xmlStrcmp((xmlChar *)"tr", name) == 0) {
        if (atts == NULL)
            return;
        int i = 0;
        const xmlChar *att = atts[i++];
        while (att != NULL) {
            const xmlChar *value = atts[i++];
            if (xmlStrcmp((xmlChar *)"id", att) == 0 && xmlStrlen(value) > 2 &&
                xmlStrncmp((xmlChar *)"tr", value, 2) == 0) {
                cout << "tr_id: " << value << endl;
            }
            att = atts[i++];
        }
    }
}

void on_end_element(void *ctx, const xmlChar *name) {
    if (xmlStrcmp((xmlChar *)"tr", name) == 0) {
        cout << "tr_end" << endl;
    }
}

void on_characters(void *ctx, const xmlChar *chars, int len) {
    // cout << "on_characters: " << chars << endl;
}

void parse_html(string html) {
    htmlSAXHandler handler = {
        NULL,           NULL, NULL,          NULL, NULL,
        NULL,           NULL, NULL,          NULL, NULL,
        NULL,           NULL, NULL,          NULL, on_start_element,
        on_end_element, NULL, on_characters, NULL, NULL,
        NULL,           NULL, NULL,          NULL, NULL,
        NULL,           NULL};
    htmlParserCtxtPtr ctxt = htmlCreatePushParserCtxt(&handler, NULL, "", 0, "",
                                                      XML_CHAR_ENCODING_NONE);
    htmlParseChunk(ctxt, html.c_str(), html.size(), 0);
    htmlFreeParserCtxt(ctxt);
}

int main(int argc, char *argv[]) {
    string query = "Beispiel";
    string url = "https://www.dict.cc/?s=";

    string body = http_get(url, query);
    if (body == "")
        return 1;

    parse_html(body);

    // cout << body << endl;
    return 0;
}
