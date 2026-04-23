## 🗺️ AWS 아키텍처 다이어그램

![aws-architecture](https://github.com/user-attachments/assets/92c1a636-5431-45d3-82ba-ce8c94d384fa)

1. **ECR(Elastic Container Registery)** 에 Docker 이미지 업로드
2. **ECS(Elastic Container Service) Cluster** 생성
    - 두 서비스 간의 연결을 위해 **브릿지 모드** 설정
3. ECS의 *용량 공급자*로 **EC2 인스턴스** 생성 (_Auto Scaling_ 적용)
4. *ECR 이미지*를 기반으로 _Task Definition_ 생성
5. **Task Definition**을 바탕으로 _ECS 서비스_ 생성
6. **ECS 서비스**에서 태스크 실행 (**Auto Scaling** 적용)
7. **ALB(Application Load Balencer)** 연결을 통해 외부 트래픽 라우팅
