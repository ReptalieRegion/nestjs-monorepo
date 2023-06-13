import PostWrite from '../atoms/PostWrite';
import ScrollToTopButton from '../atoms/ScrollToTopButton';

const FloatingActionButtons = () => {
    return (
        <div className="fixed bottom-110pxr right-20pxr w-50pxr h-50pxr">
            <ScrollToTopButton className="z-0" />
            <PostWrite className="z-10" />
        </div>
    );
};

export default FloatingActionButtons;
