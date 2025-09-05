FROM alpine:latest AS builder

ARG PB_VERSION=0.29.3
WORKDIR /pb
RUN apk add --no-cache wget unzip \
  && wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_arm64.zip \
  && unzip pocketbase_${PB_VERSION}_linux_arm64.zip \
  && rm pocketbase_${PB_VERSION}_linux_arm64.zip

FROM alpine:latest
WORKDIR /pb
COPY --from=builder /pb/pocketbase /pb/pocketbase
EXPOSE 8090
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]
