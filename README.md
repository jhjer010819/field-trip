# 교외체험학습 서류 헬퍼

교외체험학습 신청 사유와 결과보고서 느낀점 초안을 한 페이지에서 만드는 화면입니다.

학년, 체험 종류, 세부 목적, 장소, 동반자를 고르고 생성 버튼을 누르면 페이지를 옮기지 않고 아래에 문장이 나옵니다. 문장은 브라우저 안에서만 만들어지며 서버로 보내지 않습니다. 새로 만들기로 조건과 결과를 처음 상태로 되돌릴 수 있습니다.

아래쪽에는 About, Privacy, 이용약관 페이지만 연결되어 있습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

개발 서버는 `http://127.0.0.1:3847` 에서 열립니다.

```bash
npm run lint
npm run build
npm start
```

`npm start`는 `PORT`가 있으면 그 포트를, 없으면 3847을 사용합니다.

## GitHub Pages

이 사이트는 `jhjer010819`의 다른 마이멜로 제품과 같이 GitHub Pages로 올립니다. 빌드 결과는 `out/`이고, `public/CNAME`은 `fieldtrip.mymallow.cloud`입니다.

저장소를 만든 뒤 Settings → Pages → Source를 **GitHub Actions**로 두고 `main`에 푸시하면 배포됩니다.

Cloudflare DNS에 이 레코드를 추가합니다. 프록시(주황 구름)는 끄고 DNS만 사용합니다.

| Host | Type | Value |
|------|------|-------|
| fieldtrip | CNAME | jhjer010819.github.io |
