# dict.cc

**Command line interface for [dict.cc](https://dict.cc).**

## Example

```
$ dict Beispiel
instance               | Beispiel
example <ex>           | Beispiel <Bsp., Beisp.>
paradigm               | Beispiel [Vorbild, Modell]
sample                 | Beispiel
model                  | Beispiel
illustration [example] | Beispiel
for instance [coll.]   | Beispiel
as an example          | als Beispiel
by way of example      | als Beispiel
by way of illustration | als Beispiel [zur Veranschaulichung]
without precedent      | ohne Beispiel
say                    | zum Beispiel <z. B.>
exempli gratia <e.g.>  | zum Beispiel <z. B.>
for example <e.g.>     | zum Beispiel <z. B.>
for instance <f.i.>    | zum Beispiel <z. B.>

```

## Installation

**MacOS - [Node](https://nodejs.org):**

```sh
curl -o /usr/local/bin/dict https://raw.githubusercontent.com/MarkTiedemann/dict.cc/master/dict.js
chmod +x /usr/local/bin/dict
```

**MacOS - [Deno](https://deno.land):**

```sh
curl -o /usr/local/bin/dict https://raw.githubusercontent.com/MarkTiedemann/dict.cc/master/dict.ts
chmod +x /usr/local/bin/dict
```

## Todos

- Provide installation instructions for Windows
- Finish C++ implementation
- Add CI, including tests and automated releases
- Implement pagination (dict has a limit of 50 items per page; there can be multiple pages; use "pagenum" query param)
- Implement suggestions (e.g https://www.dict.cc/?s=eexample -> Did you mean "example"?)
- Use HTTP caching (ETag -> If-None-Match); save ETags and responses in OS cache dir
- Improve user experience for poor connectivity; show progress bar based on Content-Length

## License

[Blue Oak](https://blueoakcouncil.org/license/1.0.0)
