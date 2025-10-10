---
title: "A Dynamic E-Ink Weather Dashboard"
date: "2025-08-30"
tags: ["project"]
---

<figure class="full-image">
  <Image src="images/weather/cover.png" alt="Alt text"/>
  <figcaption>if only I already had a way to see the weather</figcaption>
</figure>

<span class="first">E</span>very so often I find myself experiencing *minor* inconveniences that I can't really be bothered to fix, like having to open my phone to look at the weather before I go outside for the day. Instead, I end up just ignoring them, and in this case, never managing to dress according to the weather.

So in order for me to dress in weather appropriate clothing, I've created a device which lowers the mental friction of checking the weather as much as possible. Also it looks pretty cool, and gives me an excuse to work with an e-ink display.

## Specs
<figure class="medium-right-image">
  <Image src="images/weather/internals.jpg" alt="Alt text"/>
  <figcaption>internals from early development</figcaption>
</figure>

The dashboard runs on an esp-32, mounted with a generic wroom-32 devboard 🤗.

The screen is a non-touch screen standard e-ink display,
- two coloured
- 4.2"
- 400 x 300 px
- spi connection
- [found here](https://www.aliexpress.com/item/1005007133350270.html)
- same 1800mAh ps3 controller battery I used for [my keyboard](/totalumbrel.la/crest61)

Generally, these parts are those that you can get fairly easily off online retailers like aliexpress. They're cheap too so thats good for hobby projects such as this one.

The hardware and connection is really simple, so I won't go into much detail.
## Software

The code runs from an arduino sketch flashed into the esp32 memory, and is structured similarly to c++.

To begin with, the arduino connects to local wifi with credentials stored in an accompanying file.
```c++
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println(weatherStatesDay[0].name);

  Serial.println("\nConnecting");

  while(WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(200);
  } 
```
Then, the esp32 pulls current time and sends a fetch request to [open-meteo](https://open-meteo.com/)'s free weather api, with arguments in the api link. 

```c++
DynamicJsonDocument weather() {
  const char* url = "https://api.open-meteo.com/v1/endpoint-obfuscated";
  
  HTTPClient http;
  http.begin(url);
  
  DynamicJsonDocument doc(8192); // Increased from 1024 to handle large weather response

  int httpCode = http.GET();
  if (httpCode > 0) {
    DeserializationError error = deserializeJson(doc, http.getString());
    if (error) {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
    }
  } 
  else {
    Serial.printf("get request 0 :(");
  }

  http.end();
  return doc;
}
```

This data is deserialized into a **dynamic json document** that can be used by the esp32. Then, data is handled and drawn onto the screen using various functions from the [GxEPD2](https://github.com/ZinggJM/GxEPD2) display library that the e-ink display uses.

```c++
//this code is for the bottom temperature and rainfall forecast

int x = 34; // initial left margin
for (int i = 0; i < 21; i++) {
  int height = mappedTemps[i];
  int rainHeight = rain[i];
  if (rainHeight > height) {
    Serial.println("above");
    display.fillRect(x-1, 281-height, 14, height, GxEPD_BLACK); // x, y, width, height
    display.fillRect(x, 281-rainHeight, 12, 2, GxEPD_BLACK);
  } 
  else if (rainHeight == height) {
    Serial.println(i);
    display.fillRect(x, 281-height, 12, height, GxEPD_BLACK);
  }
  else if (rainHeight < height) {
    display.fillRect(x, 281-height, 12, height, GxEPD_BLACK);
    display.fillRect(x, 281-rainHeight, 12, 2, GxEPD_WHITE);
  }
  x += 12 + 4; // rect width + gap
}
```

The last bit of interesting code is the icon drawing,

```c++
display.setCursor(5, 168);
display.setFont(&FreeMonoBold12pt7b);
display.print(state);
if (bitmapBool){
  display.drawInvertedBitmap(10,10, bitmap, 80, 80, GxEPD_BLACK);
}
```
As seen here, glyph bitmaps are stored as **arrays of bits** in an accompanying file, and drawn using GxEPD2 as necessary.

## Design
<figure class="left-image">
  <Image src="images/weather/design.png" alt="Alt text"/>
  <figcaption>Angled section view</figcaption>
</figure>

Like the electronics, the design is **fairly** simple as well. The shell is composed of a casing and a back plate, joined with 4 m3 screws on each corner. The internals are affixed using press fits.👌

> (There's also an external stand with rubber feet to keep the device on an angle when its placed on a desk, but I haven't got it shown)

That's about it for this project, I think it served as a good light project to keep me busy in my spare time during the semester ‼️. Retrospectively, I probably could have gotten it done a lot faster if I just sat down and worked on it, but a lot of time was spent working on it in the background of doing something else. 

