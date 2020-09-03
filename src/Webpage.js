class Webpage
{
    constructor(avenue)
    {
        this.avenue = avenue;
        this.path = window.location.href.split('#')[1];

        if (this.path === undefined) this.goToPath('demo');
        if (this.path.substr(0,1) === '/') this.path = this.path.substr(1, this.path.length);
    }

    goToPath(path)
    {
        this.path =  path;
        window.location.replace(
            this.generatePath(this.path)
        );
    }

    generatePath(path)
    {
        return window.location.origin + window.location.pathname + '#/' + path;
    }

    generateParentPath()
    {
        let pathArr = window.location.hash.split('/');

        if (pathArr[0] === '#')
        {
            pathArr.shift();
        }

        let avenue = pathArr.shift();

        if (!pathArr.length)
        {
            return;
        }

        pathArr.pop();

        let path = window.location.origin + window.location.pathname + '#/' + avenue + '/';

        for (let pathItem of pathArr)
        {
            path += pathItem + '/';
        }

        if (path.charAt(path.length - 1) == '/')
        {
            path = path.substring(0, path.length - 1);
        }

        return path;
    }

    displayToolbar(avenue, avenueName)
    {
        let parentPath = this.generateParentPath();
        $('#back').hide();
        $('#home').hide();
        if (avenue.buttons) {
            for (let button of avenue.buttons)
            {
                switch (button) {
                    case 'back':
                        if (parentPath) {
                            $('#back').show().attr('href', parentPath);
                        }
                        break;
                    case 'home':
                        if (parentPath) {
                            $('#home').show().attr('href', this.generatePath(avenueName));
                        }
                        break;
                }
            }
        }
    }

    displayStep(step)
    {
        document.title = step.title;
        $('#step-title').empty().html(step.title);
        $('#step-content').empty().html(step.content);
        $('#step-options').empty().html(step.options);
    }

    generateUrlForAvenue(avenue)
    {
        return this.generatePath(avenue);
    }

    generateUrlForReference(reference)
    {
        let step = this.avenue.getStepByReference(reference);
        let path = this.avenue.findPathForReference(reference);
        return this.generatePath(this.avenue.name + path)
    }

    generateRelativeUrlForStep(title)
    {
        let slug = this.generateSlug(title);
        return this.generatePath(this.path + '/' + slug);
    }

    generateSlug(string)
    {
        return string
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
        ;
    }
}
