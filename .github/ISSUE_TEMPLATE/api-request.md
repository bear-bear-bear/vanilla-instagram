---
name: API request
about: 새로운 API 요청 혹은 기존 API의 변경 요청
title: "[API]"
labels: api
assignees: ''

---

어떤 기능에 대한 API인지 설명
---
(Ex - 게시판 글 목록을 불러오는 API)
<br>
<br>

원하는 기능 혹은 변경 사항에 대한 구체적인 설명
---
(Ex - 요청 시 쿼리 스트링에 지정한 limit(number)만큼의 게시물을 응답으로 보내주세요)
<br>
<br>

응답에서 원하는 JSON 형식
---
Ex -
``` json
{
  "posts": [
    {
      "id": 1,
      "title": "글 제목입니다",
      "content": "글 내용입니다",
      "images": [
        "image/path/1",
        "image/path/2"
      ]
    },
    {
      "id": 2,
      "title": "글 제목입니다",
      "content": "글 내용입니다",
      "images": [
        "image/path/3",
        "image/path/4"
      ]
    },
    ...
  ]
}
```
