## 📦 배치 다이어그램

![deployment](https://github.com/user-attachments/assets/8f36e425-cc3f-4d7a-9f5c-66e133bbfc81)

1. **NestJS 프레임워크**를 사용해 백엔드 서비스 구축
2. NestJS의 *MicroService 모듈*을 사용해 두 개의 마이크로서비스로 구현
3. **API 서비스**
    - _REST API_ 방식으로 외부 요청을 처리
    - **DynamoDB**를 사용해 데이터베이스 관리
4. **Worker 서비스**
    - *NestJS Schedule 라이브러리*를 사용해 _Cron Job_ 설정으로 주기 작업 처리
    - 마이크로서비스 간 *TCP 연결*을 통해 API 서비스에서 데이터 읽기
    - REST API로 외부 서비스 (Scheduler 서비스)에서 데이터 요청
    - 데이터 통합하고 **OneSignal**를 통해 알림을 전송
5. 각 마이크로 서비스는 **Docker Image** 생성하여 컨테이너화
6. **Docker Compose**로 마이크로서비스와 관련 서비스(DB)를 관리하고 배포
