using AutoMapper;
using FishersSite.Dtos;
using FishersSite.Models;

namespace FishersSite.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDTO>();
            CreateMap<UserDTO, User>();
        }
    }
}