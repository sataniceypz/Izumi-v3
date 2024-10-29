FROM quay.io/eypzgod/izumi:latest
EXPOSE 3000
RUN git clone https://github.com/sataniceypz/Izumi-md /root/bot/
WORKDIR /root/bot/
RUN yarn install --network-concurrency 1
CMD ["npm", "start"]
