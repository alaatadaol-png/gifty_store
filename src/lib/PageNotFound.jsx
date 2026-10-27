import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-cream">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-7xl font-light text-ink/20">404</h1>
                    <div className="h-0.5 w-16 bg-ink/10 mx-auto"></div>
                </div>
                
                <div className="space-y-3">
                    <h2 className="text-2xl font-heading text-ink">
                        الصفحة غير موجودة
                    </h2>
                    <p className="text-ink/60 leading-relaxed">
                        عذراً، الصفحة التي تبحث عنها <span className="font-medium">"{pageName}"</span> غير متوفرة أو تم نقلها.
                    </p>
                </div>
                
                <div className="pt-6">
                    <Link to="/">
                        <Button className="rounded-none bg-royal px-8 py-6 text-cream hover:bg-royal/90">
                            العودة للرئيسية
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}