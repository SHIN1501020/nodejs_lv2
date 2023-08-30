# nodejs_lv1
1. 수정, 삭제 API에서 Resource를 구분하기 위해서 Request를 어떤 방식으로 사용하셨나요? (`param`, `query`, `body`)

   param, body 사용

   
2. HTTP Method의 대표적인 4가지는 `GET`, `POST`, `PUT`, `DELETE` 가있는데 각각 어떤 상황에서 사용하셨나요?

   GET : 조회
   POST : 생성
   PUT : 수정
   DELETE : 삭제

   
3. RESTful한 API를 설계했나요? 어떤 부분이 그런가요? 어떤 부분이 그렇지 않나요?

   method 사용에 있어서는 RESTful 한 것 같다. 대신 url에서 param를 '_'으로 시작했는데 이게 RESTful하다고 볼 수 있는지 모르겠다.

   
5. 역할별로 Directory Structure를 분리하였을 경우 어떠한 이점이 있을까요?

   나눌 때는 복잡하다고 느꼈는데, 기능별로 분리하니까 원하는 지점으로 바로 찾아갈 수 있었다.
