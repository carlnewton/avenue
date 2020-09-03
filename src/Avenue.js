class Avenue
{
    constructor()
    {
        this.webpage = new Webpage(this);
        this.getAvenue();
    }

    getAvenue()
    {
        var avenuePathname = this.webpage.path;
        if (avenuePathname.includes('/'))
        {
            avenuePathname = avenuePathname.split('/')[0];
        }

        var _this = this;
        $.getJSON('avenues/' + avenuePathname + '.json', function(json) {
            _this.name = avenuePathname;
            _this.avenue = json;
            _this.setStepFromPath();
            _this.webpage.displayToolbar(_this.avenue, _this.name);
            _this.webpage.displayStep(_this.step);
        });
    }

    setStepFromPath()
    {
        let avenuePath = this.webpage.path;
        if (!avenuePath.includes('/')) this.step = new Step(this, this.avenue);

        let avenueSteps = avenuePath.split('/');
        avenueSteps.shift();
        let step = this.getStepThroughSlugStack(avenueSteps, this.avenue);

        if (step === undefined)
        {
            this.webpage.goToPath(this.name);
        }

        this.step = new Step(this, step);
    }

    getStepPath(step)
    {
        if (step.goto)
        {
            return this.webpage.generateUrlForReference(step.goto);
        }

        if (step.avenue)
        {
            return this.webpage.generateUrlForAvenue(step.avenue);
        }

        if (step.url)
        {
            return step.url;
        }

        return this.webpage.generateRelativeUrlForStep(step.title);
    }

    getStepThroughSlugStack(stack, step)
    {
        if (stack.length === 0) return step;
        let slug = stack.shift();
        for (let subStep of step.steps)
        {
            if (subStep.goto) subStep = this.getStepByReference(subStep.goto);

            let stepSlug = this.webpage.generateSlug(subStep.title);
            if (stepSlug === slug) return this.getStepThroughSlugStack(stack, subStep)
        }
    }

    findPathForReference(reference, step='', path='')
    {
        if (step === '')
        {
            step = this.avenue;
        } else {
            path += '/' + this.webpage.generateSlug(step.title);
        }
        if (step.reference === reference)
        {
            return path;
        }

        if (reference === 'home')
        {
            return path;
        }

        if (!step.steps)
        {
            return false;
        }

        for (let subStep of step.steps)
        {
            if (!subStep.title)
            {
                continue;
            }

            let pathFound = this.findPathForReference(reference, subStep, path);
            if (pathFound) return pathFound;
        }

        return false;
    }

    getStepByReference(reference, step=this.avenue)
    {
        if (step.reference === reference) return step;

        if (step.steps)
        {
            for (let subStep of step.steps)
            {
                var foundStep = this.getStepByReference(reference, subStep);
                if (foundStep) {
                    return foundStep;
                }
            }
        }
    }
}
