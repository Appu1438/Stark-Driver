export const getAvatar = (gender: any) => {
    if (gender?.toLowerCase() === "male") {
        return "https://i.pravatar.cc/150?img=12";
    } else if (gender?.toLowerCase() === "female") {
        return "https://i.pravatar.cc/150?img=47";
    } else {
        return "https://i.pravatar.cc/150";
    }
};

