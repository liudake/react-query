import httpClient from "../utils/http-client";

/**
 * 查询QQ信息
 * @param qq
 * @returns {AxiosPromise}
 */

export const getInfoQq = async (val) => {
  const response = await httpClient.fetch({
    url: `/api/qq.info?qq=${val}`,
    method: "GET",
  });
  return response;
};
