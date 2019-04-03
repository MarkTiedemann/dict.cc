#include <curl/curl.h>
#include <iostream>
#include <iterator>
#include <sstream>
#include <string>
#include <vector>

using namespace std;

int on_write(char *data, size_t size, size_t len, string *buf) {
  if (buf == NULL) {
    return 0;
  }
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

void replace_str(string *str, const string &from, const string &to) {
  size_t start_pos = 0;
  while ((start_pos = str->find(from, start_pos)) != string::npos) {
    str->replace(start_pos, from.length(), to);
    start_pos += to.length();
  }
}

string join_str(vector<string> strs) {
  ostringstream stream;
  auto b = begin(strs), e = end(strs);
  if (b != e) {
    copy(b, prev(e), ostream_iterator<string>(stream, " "));
    b = prev(e);
  }
  if (b != e) {
    stream << *b;
  }
  return stream.str();
}

int main(int argc, char *argv[]) {
  vector<string> args(argv + 1, argv + argc);
  string query = join_str(args);
  string url = "https://www.dict.cc/?s=";
  string body = http_get(url, query);
  if (body == "") {
    return 1;
  }
  // TODO: adjust indices to account for str length
  // TODO: find closing ">" of open tag
  int open_tr = 0, close_tr = 0;
  while ((open_tr = body.find("<tr id", close_tr)) != string::npos &&
         (close_tr = body.find("</tr>", open_tr)) != string::npos) {
    int open_td = 0, close_td = open_tr;
    while ((open_td = body.find("<td", close_td)) != string::npos &&
           (close_td = body.find("</td>", open_td)) != string::npos &&
           open_td < close_tr) {
      int open_a = 0, close_a = open_td;
      while ((open_a = body.find("<a", close_a)) != string::npos &&
             (close_a = body.find("</a>", open_a)) != string::npos &&
             open_a < close_td) {
        string a = body.substr(open_a, close_a - open_a);
        replace_str(&a, "<b>", "");
        replace_str(&a, "</b>", "");
        replace_str(&a, "&lt;", "<");
        replace_str(&a, "&gt;", ">");
        cout << a << endl;
      }
    }
  }
  return 0;
}
