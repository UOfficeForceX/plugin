using Ede.Uofx.Customize.Web.Interface;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Ede.Uofx.Customize.Web.Extensions
{
    public static class ResponseExtensions
    {
        //private static HttpStatusCode Parse(string type)
        //{
        //    if (!string.IsNullOrEmpty(type) && Enum.TryParse(type, out NotOkResponse error))
        //    {
        //        switch (error)
        //        {
        //            case NotOkResponse.DidBadRequest: return HttpStatusCode.BadRequest;

        //            case NotOkResponse.DidError: return HttpStatusCode.InternalServerError;
        //        }
        //    }

        //    return HttpStatusCode.OK;
        //}


        public static IActionResult ToHttpResponse(this IResponse response)
        {
            return new JsonResult(response)
            {
                StatusCode = 200
            };
        }

        public static IActionResult ToBadHttpResponse(this IBadResponse response)
        {
            var status =HttpStatusCode.BadRequest;

            return new JsonResult(response)
            {
                StatusCode = (int)status
            };
        }



        public static IActionResult ToHttpResponse<TModel>(ISingleResponse<TModel> response)
        {
            return new JsonResult(response)
            {
                StatusCode = 200
            };
        }

        public static IActionResult ToHttpResponse<TModel>(IListResponse<TModel> response)
        {
            return new JsonResult(response)
            {
                StatusCode = 200
            };
        }
    }
}
